import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import axios from 'axios';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
// Pages
import Home from './pages/Home';
import Car from './pages/Car';
import Login from './pages/Login';
import RegisterUser from './pages/Register';
import ReservationsPage from './pages/Reservations';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import BookCar from './pages/BookCar';
import Booking from './pages/Booking';
import MyReservations from './pages/MyReservations';
import Profile from './pages/Profile';
import CusDashboard from './pages/CusDashboard';
import AdminDashboard from './pages/AdminDashboard';

import AboutUs from './pages/AboutUs';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactUs from './pages/ContactUs';

import Unauthorized from './pages/Unauthorized';




function App() {
  const [paypalClientId, setPaypalClientId] = useState('');

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now(); // Check if token is expired
    } catch {
      return true; // If token is invalid, treat it as expired
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !token || isTokenExpired(token)) {
      localStorage.clear();
      // window.location.href = '/login';
    }

    const fetchPaypalClientId = async () => {
      try {
        const { data } = await axios.get('/api/config/paypal');
        setPaypalClientId(data);
      } catch (error) {
        console.error('Failed to fetch PayPal Client ID:', error);
      }
    };

    fetchPaypalClientId();
  }, []);

  if (!paypalClientId) {
    return <div>Loading...</div>; // Show a loading state until the client ID is fetched
  }

  return (
    <div className="App">
      <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
        <BrowserRouter>
          <div className="layout">
            <Navbar /> {/* Sticky header */}
            <div className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterUser />} />

                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/reset-password/:resetToken" element={<ResetPassword />} />


                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/contact-us" element={<ContactUs />} />

                {/* Admin-only routes */}
                <Route path='/dashboard' element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/cars" element={<ProtectedRoute allowedRoles={['admin']}><Car /></ProtectedRoute>} />
                <Route path="/reservations" element={<ProtectedRoute allowedRoles={['admin']}><ReservationsPage /></ProtectedRoute>} />

                {/* Customer-only routes */}
                <Route path='/home' element={<ProtectedRoute allowedRoles={['customer']}><CusDashboard /></ProtectedRoute>} />
                <Route path="/BookCar" element={<ProtectedRoute allowedRoles={['customer']}><BookCar /></ProtectedRoute>} />
                <Route path="/book/:carId" element={<ProtectedRoute allowedRoles={['customer']}><Booking /></ProtectedRoute>} />
                <Route path='/MyReservations' element={<ProtectedRoute allowedRoles={['customer']}><MyReservations /></ProtectedRoute>} />
                <Route path='/Profile' element={<ProtectedRoute allowedRoles={['customer']}><Profile /></ProtectedRoute>} />
                <Route path="/changePassword" element={<ProtectedRoute allowedRoles={['customer']}><ChangePassword /></ProtectedRoute>} />

                {/* Unauthorized page */}
                <Route path="/unauthorized" element={<Unauthorized />} />
              </Routes>
            </div>
            <Footer /> {/* Footer at the bottom */}
          </div>
        </BrowserRouter>
      </PayPalScriptProvider>
    </div>
    // <div className="App">
    //   <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
    //     <BrowserRouter>
    //       <Navbar />
    //       <div className="pages">
    //         <Routes>
    //           <Route path="/" element={<Home />} />
    //           <Route path="/login" element={<Login />} />
    //           <Route path="/register" element={<RegisterUser />} />
    //           <Route path="/forgotPassword" element={<ForgotPassword />} />

    //           {/* Admin-only route */}
    //           <Route path='/dashboard' element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
    //           <Route path="/cars" element={<ProtectedRoute allowedRoles={['admin']}><Car /></ProtectedRoute>} />
    //           <Route path="/reservations" element={<ProtectedRoute allowedRoles={['admin']}><ReservationsPage /></ProtectedRoute>} />


    //           {/* Customer-only route */}
    //           <Route path='/home' element={<ProtectedRoute allowedRoles={['customer']}><CusDashboard /></ProtectedRoute>} />
    //           <Route path="/BookCar" element={<ProtectedRoute allowedRoles={['customer']}><BookCar /></ProtectedRoute>} />
    //           <Route path="/book/:carId" element={<ProtectedRoute allowedRoles={['customer']}><Booking /></ProtectedRoute>} />
    //           <Route path='/MyReservations' element={<ProtectedRoute allowedRoles={['customer']}><MyReservations /></ProtectedRoute>} />
    //           <Route path='/Profile' element={<ProtectedRoute allowedRoles={['customer']}><Profile /></ProtectedRoute>} />
    //           <Route path="/changePassword" element={<ProtectedRoute allowedRoles={['customer']}><ChangePassword /></ProtectedRoute>} />
    //           <Route path="/reset-password/:resetToken" element={<ProtectedRoute allowedRoles={['customer']}><ResetPassword /></ProtectedRoute>} />

    //           {/* Unauthorized page */}
    //           <Route path="/unauthorized" element={<Unauthorized />} />
    //         </Routes>
    //       </div>
    //       <Footer />
    //     </BrowserRouter>
    //   </PayPalScriptProvider>
    // </div>
  );
}

export default App;
