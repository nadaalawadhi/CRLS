import React from 'react';

const Modal = ({ car, onClose, onBookNow }) => {
  return (
    <div className="car-modal">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{backgroundColor: car.color,}}>
          <button className="close-btn" onClick={onClose}>X</button>
          <div className="modal-car-details">
            <img src={car.imageUrl} alt={`${car.make} ${car.model}`} /> {/*width="300" height="200" */}
            <h3>{car.make} {car.model} ({car.year})</h3>
            <p><strong>Category:</strong> {car.category}</p>
            <p><strong>Price per Day:</strong> {car.pricePerDay} BHD</p>
            <p><strong>Description:</strong> {car.description}</p>
            <button className="book-now-btn" onClick={() => onBookNow(car)}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
