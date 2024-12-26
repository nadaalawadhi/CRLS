import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerDashboard = () => {
  const [user, setUser] = useState(null);
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [ongoingReservations, setOngoingReservations] = useState([]);
  const [completedReservations, setCompletedReservations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        await fetchReservations(userData.id); // Fetch reservations based on user ID
      } catch (err) {
        setError('Failed to fetch user data');
      }
    };
  
    const fetchReservations = async (userId) => {
      try {
        const response = await axios.get(`/api/reservations/user/${userId}`);
        const reservations = response.data || [];
  
        // Categorize reservations based on status
        setUpcomingReservations(reservations.filter((r) => r.status === 'upcoming'));
        setOngoingReservations(reservations.filter((r) => r.status === 'ongoing'));
        setCompletedReservations(reservations.filter((r) => r.status === 'completed'));
  
        // Clear any previous error
        setError(null);
      } catch (err) {
        // Handle API error
        if (err.response && err.response.status === 404) {
          // No reservations found (API returned 404 or empty data)
          setUpcomingReservations([]);
          setOngoingReservations([]);
          setCompletedReservations([]);
          setError(null); // No error message needed if no reservations are found
        } else {
          setError('Failed to fetch reservations'); // Other API errors
        }
      }
    };
  
    fetchUserData();
  }, []);  

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await axios.put(`/api/reservations/${reservationId}/cancel`);
      const updatedReservations = ongoingReservations.filter(r => r._id !== reservationId);
      setOngoingReservations(updatedReservations);  // Update the ongoing reservations list
    } catch (err) {
      setError('Failed to cancel reservation');
    }
  };

  const calculatePeriod = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in time (in milliseconds)
    const diffInTime = end - start;
    
    // Convert milliseconds to days
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    
    return diffInDays;
  };

  if (!user) return <div>Loading user data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="customer-dashboard">

      {/* Summary Panel */}
      <div className="summary-panel">
        <h3>Your Dashboard Overview</h3>

        <div className="stats-overview">
        <div className="stats-box total-reservations">
          <div>Upcoming Reservations:</div>
          <div>{upcomingReservations.length}</div>
        </div>
        <div className="stats-box total-users">
          <div>Ongoing Reservations: </div>
          <div>{ongoingReservations.length}</div>
        </div>
        <div className="stats-box total-revenue">
          <div>Completed Reservations:</div>
          <div>{completedReservations.length}</div>
        </div>
      </div>
      </div>

      {/* Upcoming Reservations */}
      <div className="reservation-row">
        <h3>Upcoming Reservations</h3>
        {upcomingReservations.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Car</th>
                <th>Period</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Pickup Location</th>
              </tr>
            </thead>
            <tbody>
              {upcomingReservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{reservation.car.make} {reservation.car.model}</td>
                  <td>{calculatePeriod(reservation.startDate, reservation.endDate)} days</td>
                  <td>{new Date(reservation.startDate).toLocaleDateString()}</td>
                  <td>{new Date(reservation.endDate).toLocaleDateString()}</td>
                  <td>{reservation.pickupLocation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No upcoming reservations.</p>
        )}
      </div>

      {/* Ongoing Reservations */}
      <div className="reservation-row">
        <h3>Ongoing Reservations</h3>
        {ongoingReservations.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Car</th>
                <th>Period</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Return Location</th>
              </tr>
            </thead>
            <tbody>
              {ongoingReservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{reservation.car.make} {reservation.car.model}</td>
                  <td>{calculatePeriod(reservation.startDate, reservation.endDate)} days</td>
                  <td>{new Date(reservation.startDate).toLocaleDateString()}</td>
                  <td>{new Date(reservation.endDate).toLocaleDateString()}</td>
                  <td>{reservation.returnLocation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No ongoing reservations.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
