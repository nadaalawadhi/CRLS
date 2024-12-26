// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Modal from "react-modal";
// import ReservationModal from "../components/ReservationModal"; // Import the reservation modal

// Modal.setAppElement("#root");

// const MyReservations = () => {
//   const [reservations, setReservations] = useState([]);
//   const [selectedReservation, setSelectedReservation] = useState(null);
//   const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
//   const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
//   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [error, setError] = useState(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const reservationsPerPage = 5; 

//   const indexOfLastReservation = currentPage * reservationsPerPage;
//   const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
//   const currentReservations = reservations.slice(
//     indexOfFirstReservation,
//     indexOfLastReservation
//   );

//   const paginate = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth", // Smooth scroll to top
//     });
//   };

//   useEffect(() => {
//     const fetchReservations = async () => {
//       const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user details from localStorage
//       if (user && user.id) {
//         try {
//           const response = await axios.get(`/api/reservations/user/${user.id}`); // Fetch reservations by user ID
//           setReservations(response.data);
//         } catch (err) {
//           setError("Failed to fetch reservations");
//         }
//       }
//     };

//     fetchReservations();
//   }, []);
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const reservationId = params.get('reservationId');
//     if (reservationId) {
//       const reservation = reservations.find((res) => res._id === reservationId);
//       if (reservation) {
//         openReservationModal(reservation);
//       }
//     }
//   }, [reservations]);
  

//   const openReservationModal = (reservation) => {
//     setSelectedReservation(reservation);
//     setIsReservationModalOpen(true); // Open the reservation details modal
//   };

//   const closeReservationModal = () => {
//     setIsReservationModalOpen(false);
//     setSelectedReservation(null);
//   };

//   const openConfirmationModal = () => {
//     setIsConfirmationModalOpen(true); // Open the confirmation modal
//   };

//   const closeConfirmationModal = () => {
//     setIsConfirmationModalOpen(false);
//   };

//   const openSuccessModal = (message) => {
//     setSuccessMessage(message);
//     setIsSuccessModalOpen(true); // Open the success modal
//   };

//   const closeSuccessModal = () => {
//     setIsSuccessModalOpen(false);
//     setSuccessMessage("");
//   };

//   const handleCancelReservation = async () => {
//     try {
//       await axios.put(`/api/reservations/${selectedReservation._id}/cancel`);
//       setReservations((prev) =>
//         prev.map((reservation) =>
//           reservation._id === selectedReservation._id
//             ? { ...reservation, status: "cancelled" }
//             : reservation
//         )
//       );
//       closeConfirmationModal();
//       closeReservationModal();
//       openSuccessModal("Reservation cancelled successfully!");
//     } catch (err) {
//       setError("Failed to cancel the reservation");
//       closeConfirmationModal();
//     }
//   };

//   return (
//     <div className="my-reservations-page">
//       <h2>My Reservations</h2>
//       {error && <p>{error}</p>}
//       {reservations.map((reservation) => (
//         <div
//           key={reservation._id}
//           onClick={() => openReservationModal(reservation)}
//           className="reservation-card"
//         >
//           {/* Display car details */}
//           {reservation.car ? (
//             <>
//               <img
//                 src={reservation.car.imageUrl}
//                 alt={`${reservation.car.make} ${reservation.car.model}`}
//               />
//               <div className="reservation-details">
//                 <h3>
//                   {reservation.car.make} {reservation.car.model}
//                 </h3>
//                 <p>
//                   Rental Dates:{" "}
//                   {new Date(reservation.startDate).toLocaleDateString()} -{" "}
//                   {new Date(reservation.endDate).toLocaleDateString()}
//                 </p>
//                 <p>Status: {reservation.status}</p>
//               </div>
//             </>
//           ) : (
//             <p>No car data available</p> // If car data is missing
//           )}
//         </div>
//       ))}
//       {/* Pagination */}
//       <div className="pagination">
//         {Array.from(
//           { length: Math.ceil(reservations.length / reservationsPerPage) },
//           (_, index) => (
//             <button
//               key={index + 1}
//               onClick={() => paginate(index + 1)}
//               className={currentPage === index + 1 ? "active" : ""}
//             >
//               {index + 1}
//             </button>
//           )
//         )}
//       </div>

//       {/* Reservation Details Modal */}
//       {isReservationModalOpen && selectedReservation && (
//         <Modal
//           isOpen={isReservationModalOpen}
//           onRequestClose={closeReservationModal}
//           className="reservation-modal-content"
//           overlayClassName="reservation-modal-overlay"
//         >
//           <ReservationModal
//             reservation={selectedReservation}
//             onClose={closeReservationModal}
//             onCancel={openConfirmationModal}
//           />
//         </Modal>
//       )}

//       {/* Confirmation Modal */}
//       {isConfirmationModalOpen && (
//         <Modal
//           isOpen={isConfirmationModalOpen}
//           onRequestClose={closeConfirmationModal}
//           className="confirmation-modal-content"
//           overlayClassName="reservation-modal-overlay"
//         >
//           <h3>Are you sure you want to cancel this reservation?</h3>
//           <div className="confirmation-buttons">
//             <button className="confirm-button" onClick={handleCancelReservation}>
//               Yes, Cancel
//             </button>
//             <button className="cancel-button" onClick={closeConfirmationModal}>
//               No
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* Success Modal */}
//       {isSuccessModalOpen && (
//         <Modal
//           isOpen={isSuccessModalOpen}
//           onRequestClose={closeSuccessModal}
//           className="success-modal-content"
//           overlayClassName="reservation-modal-overlay"
//         >
//           <h3>{successMessage}</h3>
//           <button className="ok-button" onClick={closeSuccessModal}>
//             OK
//           </button>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default MyReservations;
import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import ReservationModal from "../components/ReservationModal"; // Import the reservation modal

Modal.setAppElement("#root");

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 4;

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll to top
    });
  };

  useEffect(() => {
    const fetchReservations = async () => {
      const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user details from localStorage
      if (user && user.id) {
        try {
          const response = await axios.get(`/api/reservations/user/${user.id}`); // Fetch reservations by user ID
          setReservations(response.data);
        } catch (err) {
          setError("Failed to fetch reservations");
        }
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reservationId = params.get("reservationId");
    if (reservationId) {
      const reservation = reservations.find((res) => res._id === reservationId);
      if (reservation) {
        openReservationModal(reservation);
      }
    }
  }, [reservations]);

  const openReservationModal = (reservation) => {
    setSelectedReservation(reservation);
    setIsReservationModalOpen(true); // Open the reservation details modal
  };

  const closeReservationModal = () => {
    setIsReservationModalOpen(false);
    setSelectedReservation(null);
  };

  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(true); // Open the confirmation modal
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const openSuccessModal = (message) => {
    setSuccessMessage(message);
    setIsSuccessModalOpen(true); // Open the success modal
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage("");
  };

  const handleCancelReservation = async () => {
    try {
      await axios.put(`/api/reservations/${selectedReservation._id}/cancel`);
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation._id === selectedReservation._id
            ? { ...reservation, status: "cancelled" }
            : reservation
        )
      );
      closeConfirmationModal();
      closeReservationModal();
      openSuccessModal("Reservation cancelled successfully!");
    } catch (err) {
      setError("Failed to cancel the reservation");
      closeConfirmationModal();
    }
  };

  return (
    <div className="my-reservations-page">
      <h2>My Reservations</h2>
      {error && <p>{error}</p>}
      {currentReservations.map((reservation) => (
        <div
          key={reservation._id}
          onClick={() => openReservationModal(reservation)}
          className="reservation-card"
        >
          {/* Display car details */}
          {reservation.car ? (
            <>
              <img
                src={reservation.car.imageUrl}
                alt={`${reservation.car.make} ${reservation.car.model}`}
              />
              <div className="reservation-details">
                <h3>
                  {reservation.car.make} {reservation.car.model}
                </h3>
                <p>
                  Rental Dates:{" "}
                  {new Date(reservation.startDate).toLocaleDateString()} -{" "}
                  {new Date(reservation.endDate).toLocaleDateString()}
                </p>
                <p>Status: {reservation.status}</p>
              </div>
            </>
          ) : (
            <p>No car data available</p> // If car data is missing
          )}
        </div>
      ))}

      {/* Pagination */}
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(reservations.length / reservationsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          )
        )}
      </div>

      {/* Reservation Details Modal */}
      {isReservationModalOpen && selectedReservation && (
        <Modal
          isOpen={isReservationModalOpen}
          onRequestClose={closeReservationModal}
          className="reservation-modal-content"
          overlayClassName="reservation-modal-overlay"
        >
          <ReservationModal
            reservation={selectedReservation}
            onClose={closeReservationModal}
            onCancel={openConfirmationModal}
          />
        </Modal>
      )}

      {/* Confirmation Modal */}
      {isConfirmationModalOpen && (
        <Modal
          isOpen={isConfirmationModalOpen}
          onRequestClose={closeConfirmationModal}
          className="confirmation-modal-content"
          overlayClassName="reservation-modal-overlay"
        >
          <h3>Are you sure you want to cancel this reservation?</h3>
          <div className="confirmation-buttons">
            <button
              className="confirm-button"
              onClick={handleCancelReservation}
            >
              Yes, Cancel
            </button>
            <button
              className="cancel-button"
              onClick={closeConfirmationModal}
            >
              No
            </button>
          </div>
        </Modal>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <Modal
          isOpen={isSuccessModalOpen}
          onRequestClose={closeSuccessModal}
          className="success-modal-content"
          overlayClassName="reservation-modal-overlay"
        >
          <h3>{successMessage}</h3>
          <button className="ok-button" onClick={closeSuccessModal}>
            OK
          </button>
        </Modal>
      )}
    </div>
  );
};

export default MyReservations;
