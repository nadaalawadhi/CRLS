// import { Link, useNavigate } from 'react-router-dom';
// import Logo from '../assets/images/Logo3.png'; // Update the path as needed

// const Navbar = () => {
//   const navigate = useNavigate();

//   // Logout handler
//   const handleLogout = () => {
//     // Remove user data from local storage
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');

//     // Redirect to login page
//     navigate('/login');
//   };

//   const user = JSON.parse(localStorage.getItem('user'));
//   const userRole = user?.role;

//   return (
//     <header>
//       <div className="container">
//         <Link to="/">
//           {/* Use the logo image instead of "CRLS" */}
//           <img src={Logo} alt="CRLS Logo" style={{ height: '60px' }} />
//         </Link>
//         <nav>
//           <ul style={{ display: 'flex', gap: '20px', listStyleType: 'none' }}>
//             {userRole === 'admin' ? (
//               <>
//                 <li><Link to="/dashboard">Dashboard</Link></li>
//                 <li><Link to="/cars">Cars</Link></li>
//                 <li><Link to="/reservations">Reservations</Link></li>
//                 <li>
//                   <Link className='logout'
//                     to="/login"
//                     onClick={(e) => {
//                       e.preventDefault(); // Prevent navigation immediately
//                       handleLogout(); // Call the logout function
//                     }}
//                   >
//                     Logout
//                   </Link>
//                 </li>
//               </>
//             ) : userRole === 'customer' ? (
//               <>
//                 <li><Link to="/home">Home</Link></li>
//                 <li><Link to="/BookCar">Reserve a Car</Link></li>
//                 <li><Link to="/MyReservations">My Reservations</Link></li>
//                 <li><Link to="/Profile">Profile</Link></li>
//                 <li>
//                   <Link className='logout'
//                     to="/login"
//                     onClick={(e) => {
//                       e.preventDefault(); // Prevent navigation immediately
//                       handleLogout(); // Call the logout function
//                     }}
//                   >
//                     Logout
//                   </Link>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li><Link to="/login">Login</Link></li>
//                 <li><Link to="/register">Register</Link></li>
//               </>
//             )}
//           </ul>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logo from '../assets/images/Logo3.png'; // Update the path as needed

const Navbar = () => {
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);

  // Add scroll listener to update the sticky state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Logout handler
  const handleLogout = () => {
    // Remove user data from local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Redirect to login page
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role;

  return (
    <header className={isSticky ? 'sticky' : ''}>
      <div className="container">
        <Link to="/">
          {/* Use the logo image instead of "CRLS" */}
          <img src={Logo} alt="CRLS Logo" style={{ height: '60px' }} />
        </Link>
        <nav>
          <ul style={{ display: 'flex', gap: '20px', listStyleType: 'none' }}>
            {userRole === 'admin' ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/cars">Cars</Link></li>
                <li><Link to="/reservations">Reservations</Link></li>
                <li>
                  <Link className="logout"
                    to="/login"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation immediately
                      handleLogout(); // Call the logout function
                    }}
                  >
                    Logout
                  </Link>
                </li>
              </>
            ) : userRole === 'customer' ? (
              <>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/BookCar">Reserve a Car</Link></li>
                <li><Link to="/MyReservations">My Reservations</Link></li>
                <li><Link to="/Profile">Profile</Link></li>
                <li>
                  <Link className="logout"
                    to="/login"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation immediately
                      handleLogout(); // Call the logout function
                    }}
                  >
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
