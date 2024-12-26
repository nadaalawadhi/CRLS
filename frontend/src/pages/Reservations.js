// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ReservationsPage = () => {
//   const [reservations, setReservations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchReservations = async () => {
//       try {
//         const response = await axios.get('/api/reservations');
//         setReservations(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch reservations');
//         setLoading(false);
//       }
//     };

//     fetchReservations();
//   }, []);

//   const handleStatusChange = async (reservationId, newStatus) => {
//     try {
//       const response = await axios.put(`/api/reservations/${reservationId}/status`, {
//         status: newStatus,
//       });

//       // Update the reservation in the state with the new status
//       setReservations(prevReservations =>
//         prevReservations.map(reservation =>
//           reservation._id === reservationId
//             ? { ...reservation, status: response.data.status }
//             : reservation
//         )
//       );
//     } catch (err) {
//       setError('Failed to update reservation status');
//     }
//   };

//   const getStatusOptions = (currentStatus) => {
//     switch (currentStatus) {
//       case 'upcoming':
//         return (
//           <>
//             <option value="upcoming">Upcoming</option>
//             <option value="ongoing">Ongoing</option>
//             <option value="cancelled">Cancelled</option>
//           </>
//         );
//       case 'ongoing':
//         return (
//           <>
//             <option value="ongoing">Ongoing</option>
//             <option value="completed">Completed</option>
//           </>
//         );
//       default:
//         return <option value={currentStatus}>{currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}</option>;
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className='reservations-page'>
//       <h1>Reservations</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Car</th>
//             <th>User</th>
//             <th>Start Date</th>
//             <th>End Date</th>
//             <th>Total Price</th>
//             <th>Status</th>
//             <th>Change Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {reservations.map((reservation) => (
//             <tr key={reservation._id}>
//               <td>
//                 {reservation.car ? `${reservation.car.make} ${reservation.car.model}` : 'Car details not available'}
//               </td>
//               <td>{reservation.user.firstName} {reservation.user.lastName}</td>
//               <td>{new Date(reservation.startDate).toLocaleDateString()}</td>
//               <td>{new Date(reservation.endDate).toLocaleDateString()}</td>
//               <td>{reservation.totalPrice} BHD</td>
//               <td>{reservation.status}</td>
//               <td>
//                 <select
//                   value={reservation.status}
//                   onChange={(e) => handleStatusChange(reservation._id, e.target.value)}
//                   disabled={reservation.status === 'completed' || reservation.status === 'cancelled'}
//                 >
//                   {getStatusOptions(reservation.status)}
//                 </select>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ReservationsPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 5; // Number of reservations per page

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(indexOfFirstReservation, indexOfLastReservation);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('/api/reservations');
        setReservations(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch reservations');
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      const response = await axios.put(`/api/reservations/${reservationId}/status`, {
        status: newStatus,
      });

      // Update the reservation in the state with the new status
      setReservations(prevReservations =>
        prevReservations.map(reservation =>
          reservation._id === reservationId
            ? { ...reservation, status: response.data.status }
            : reservation
        )
      );
    } catch (err) {
      setError('Failed to update reservation status');
    }
  };

  const getStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case 'upcoming':
        return (
          <>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="cancelled">Cancelled</option>
          </>
        );
      case 'ongoing':
        return (
          <>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </>
        );
      default:
        return <option value={currentStatus}>{currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}</option>;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='reservations-page'>
      <h1>Reservations</h1>
      <table>
        <thead>
          <tr>
            <th>Car</th>
            <th>User</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Change Status</th>
          </tr>
        </thead>
        <tbody>
          {currentReservations.map((reservation) => (
            <tr key={reservation._id}>
              <td>
                {reservation.car ? `${reservation.car.make} ${reservation.car.model}` : 'Car details not available'}
              </td>
              <td>{reservation.user.firstName} {reservation.user.lastName}</td>
              <td>{new Date(reservation.startDate).toLocaleDateString()}</td>
              <td>{new Date(reservation.endDate).toLocaleDateString()}</td>
              <td>{reservation.totalPrice} BHD</td>
              <td>{reservation.status}</td>
              <td>
                <select
                  value={reservation.status}
                  onChange={(e) => handleStatusChange(reservation._id, e.target.value)}
                  disabled={reservation.status === 'completed' || reservation.status === 'cancelled'}
                >
                  {getStatusOptions(reservation.status)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(reservations.length / reservationsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReservationsPage;
