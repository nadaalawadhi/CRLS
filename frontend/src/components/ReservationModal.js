import React from "react";

const ReservationModal = ({ reservation, onClose, onCancel }) => {
  if (!reservation) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === "modal-overlay") {
      onClose(); // Close modal when clicking on the overlay
    }
  };

  const {
    car,
    startDate,
    endDate,
    pickupLocation,
    returnLocation,
    baseRentalFee,
    vatPrice,
    insurancePrice,
    totalPrice,
    status,
  } = reservation;

  return (
    <div className="reservation-modal">
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-container">
          {/* Modal Header */}
          <div className="modal-header">
            <h3>Reservation Details</h3>
            <button className="close-btn" onClick={onClose}>
              X
            </button>
          </div>

          {/* Modal Content */}
          <div className="modal-content">
            {/* Car Image */}
            {car.imageUrl && (
              <div className="car-section">
                <img
                  src={car.imageUrl}
                  alt={`${car.make} ${car.model}`}
                  className="car-image"
                />
              </div>
            )}

            {/* Info Sections */}
            <div className="info-sections">
              <div className="details-section reservation-info">
                <h4>Reservation Information</h4>
                <p>
                  <strong>Start Date:</strong> {new Date(startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong> {new Date(endDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Pickup Location:</strong> {pickupLocation}
                </p>
                <p>
                  <strong>Return Location:</strong> {returnLocation}
                </p>
                <p>
                  <strong>Status:</strong> {status}
                </p>
              </div>

              <div className="details-section payment-info">
                <h4>Payment Details</h4>
                <p>
                  <strong>Base Rental Fee:</strong> ${baseRentalFee.toFixed(2)}
                </p>
                <p>
                  <strong>VAT Price:</strong> ${vatPrice.toFixed(2)}
                </p>
                <p>
                  <strong>Insurance Fee:</strong> ${insurancePrice.toFixed(2)}
                </p>
                <p>
                  <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Cancel Button */}
            {status === "upcoming" && (
              <div className="button-container">
                <button className="cancel-btn" onClick={onCancel}>
                  Cancel Reservation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
