import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { PayPalButtons } from '@paypal/react-paypal-js';

const BookingPage = () => {
  const { carId } = useParams(); // Get carId from URL
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [baseRentalFee, setBaseRentalFee] = useState(0);
  const [vat, setVat] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [insuranceFee] = useState(50);
  const [exchangeRate, setExchangeRate] = useState(1); // Initialize exchange rate (1 BHD = 1 USD initially)
  const [reservationDetails, setReservationDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // Fetch BHD to USD exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/BHD'); // Example API
        setExchangeRate(response.data.rates.USD); // Update exchange rate for BHD to USD
      } catch (err) {
        console.error('Failed to fetch exchange rate', err);
      }
    };

    fetchExchangeRate();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setUserDetails(user);

    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`/api/cars/${carId}`);
        setCar(response.data);
      } catch (err) {
        console.error('Failed to fetch car details');
      }
    };

    const fetchUnavailableDates = async () => {
      try {
        const response = await axios.get(`/api/cars/${carId}/unavailable-dates`);
        setUnavailableDates(response.data);
      } catch (err) {
        console.error('Failed to fetch unavailable dates');
      }
    };

    fetchCarDetails();
    fetchUnavailableDates();
  }, [carId]);

  const handleNextStep = () => {
    if (step === 1) {
      if (!startDate || !endDate || !pickupLocation || !returnLocation) {
        alert("Please fill in all fields.");
        return;
      }

      const normalizedStartDate = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
      const normalizedEndDate = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));

      const days = Math.ceil((normalizedEndDate - normalizedStartDate) / (1000 * 3600 * 24)) + 1;
      const rentalFee = days * car.pricePerDay;
      const vatAmount = rentalFee * 0.1; // 10% VAT
      const total = rentalFee + vatAmount + insuranceFee;

      setBaseRentalFee(rentalFee);
      setVat(vatAmount);
      setTotalPrice(total);

      setReservationDetails({
        car: carId,
        user: userDetails?.id,
        startDate: normalizedStartDate,
        endDate: normalizedEndDate,
        pickupLocation,
        returnLocation,
        baseRentalFee: rentalFee,
        vatPrice: vatAmount,
        insurancePrice: insuranceFee,
        totalPrice: total,
      });

      setStep(step + 1);
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      const response = await axios.post('/api/reservations', {
        ...reservationDetails,
        paymentMethod: 'PayPal',
        isPaid: true,
        paidAt: new Date(),
        paymentResult: details,
      });

      console.log('Reservation successful:', response.data);
      setStep(3); // Move to the confirmation page
    } catch (err) {
      console.error('Failed to complete the reservation:', err.response?.data || err);
      alert(`Error: ${err.response?.data?.message || 'Failed to create reservation'}`);
    }
  };

  if (!car) {
    return <p>Loading car details...</p>;
  }

  // Convert total price to USD before passing to PayPal
  const totalPriceInUSD = (totalPrice * exchangeRate).toFixed(2);

  return (
    <div className="booking-page">
      {step === 1 && (
        <form>
          <h2>Booking Form</h2>
          <div>
            <label>Select Rental Period:</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              {/* Start Date Picker */}
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  if (date === null) {
                    // Handle clear button
                    setStartDate(null);
                    setEndDate(null); // Clear end date as well
                  } else {
                    const normalizedDate = new Date(date);
                    setStartDate(normalizedDate);
                    setEndDate(null); // Clear end date if start date changes
                  }
                }}
                startDate={startDate}
                endDate={endDate}
                selectsStart
                placeholderText="Start Date"
                minDate={new Date(new Date().setDate(new Date().getDate() + 1))} // Tomorrow
                excludeDates={unavailableDates.map((date) => new Date(date))}
                filterDate={(date) => {
                  if (!date) return true; // Allow null state (cleared date)
                  return unavailableDates.every(
                    (excludedDate) => new Date(excludedDate).getTime() !== date.getTime()
                  );
                }}                
                dateFormat="yyyy/MM/dd"
                isClearable
                required
              />

              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  const normalizedDate = new Date(date);
                  setEndDate(normalizedDate);
                }}
                startDate={startDate}
                endDate={endDate}
                selectsEnd
                placeholderText="End Date"
                minDate={startDate} // Allow the same day as `startDate` for single-day rentals
                excludeDates={unavailableDates.map((date) => new Date(date))}
                filterDate={(date) => {
                  if (!startDate) return true;

                  // Ensure the range does not include any excluded dates except the startDate
                  const range = [];
                  for (
                    let d = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // Start validating from the day after `startDate`
                    d <= new Date(date);
                    d.setDate(d.getDate() + 1)
                  ) {
                    range.push(new Date(d).toISOString().split('T')[0]);
                  }

                  return range.every(
                    (rangeDate) =>
                      unavailableDates.every(
                        (excludedDate) =>
                          new Date(excludedDate).toISOString().split('T')[0] !== rangeDate
                      )
                  );
                }}
                dateFormat="yyyy/MM/dd"
                isClearable
                required
              />
            </div>
          </div>

          <div>
            <label>Pickup Location:</label>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="Manama Branch">Manama Branch</option>
              <option value="Riffa Branch">Riffa Branch</option>
              <option value="Muharraq Branch">Muharraq Branch</option>
            </select>
          </div>
          <div>
            <label>Return Location:</label>
            <select
              value={returnLocation}
              onChange={(e) => setReturnLocation(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="Manama Branch">Manama Branch</option>
              <option value="Riffa Branch">Riffa Branch</option>
              <option value="Muharraq Branch">Muharraq Branch</option>
            </select>
          </div>
          <button type="button" onClick={handleNextStep}>
            Next: Summary
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="Summary">
          <h2>Summary</h2>
          <h3>Reservation Summary</h3>
          <p>Car: {car.make} {car.model}</p>
          <p>Start Date: {new Date(startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(endDate).toLocaleDateString()}</p>
          <p>Pickup Location: {pickupLocation}</p>
          <p>Return Location: {returnLocation}</p>
          <h3>Price Summary</h3>
          <p>Base Rental Fee: {baseRentalFee.toFixed(2)} BHD</p>
          <p>VAT: {vat.toFixed(2)} BHD</p>
          <p>Insurance: {insuranceFee.toFixed(2)} BHD</p>
          <p><strong>Total Price: {totalPrice.toFixed(2)} BHD</strong></p>
          <br />
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{ amount: { value: totalPriceInUSD } }],
              });
            }}
            onApprove={async (data, actions) => {
              const details = await actions.order.capture();
              handlePaymentSuccess(details);
            }}
          />
        </div>
      )}

      {step === 3 && (
        <div className="confirmation-section">
          <h2>Confirmation</h2>
          <p className="important">Your reservation is confirmed!</p>
          <p>
            A confirmation email with your reservation details has been sent to your email address.
            Please check your inbox or spam folder for further details.
          </p>
          <p>
            If you have any questions or need assistance, feel free to contact our support team.
            Thank you for choosing our service!
          </p>
          <button onClick={() => navigate('/home')}>Back to Home</button>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
