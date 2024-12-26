import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //   setSuccess(null);
  //   try {
  //     await axios.post('/api/auth/register', formData); // API call
  //     setSuccess('Registration successful! Redirecting to login...');
      
  //     // Navigate to login page after a delay
  //     setTimeout(() => {
  //       navigate('/login'); // Navigate to login page
  //     }, 2000); // Delay for 2 seconds to show the success message
  //   } catch (err) {
  //     setError('Error during registration');
  //   }
  // };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.post('/api/auth/register', formData); // API call
      setSuccess('Registration successful! Redirecting to login...');
      
      // Navigate to login page after a delay
      setTimeout(() => {
        navigate('/login'); // Navigate to login page
      }, 2000); // Delay for 2 seconds to show the success message
    } catch (err) {
      // Display detailed server-side error messages if available
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.join(', '));
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred during registration.');
      }
    }
  };

  
  return (
    <div className="register-page">
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
        <button type="submit">Register</button>
        <p>Already have an account? <Link to={"/login"}>Login</Link></p>
      </form>
    </div>
  );
};

export default Register;
