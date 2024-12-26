// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';  // Import useParams to capture the reset token from URL

// const ResetPasswordPage = () => {
//   const { resetToken } = useParams();  // Use useParams() to get the resetToken from the URL
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [message, setMessage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();  // For navigating programmatically after success

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     console.log('Sending reset token:', resetToken);  // Log the token being sent
  
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }
  
//     setLoading(true);
//     setError(null);
//     setMessage(null); 
//     try {
//       const response = await axios.post(`/api/users/reset-password/${resetToken}`, { 
//         newPassword 
//       });
      
  
//       setMessage(response.data.message);  // Show success message from the backend
//       setTimeout(() => {
//         navigate('/login');  // Redirect user to login page after password reset
//       }, 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to reset password');
//     } finally {
//       setLoading(false);
//     }
//   };
  
  

//   return (
//     <div className='reset-password-container'>
//       <h2>Reset Your Password</h2>

//       {message && <div className="success">{message}</div>}
//       {error && <div className="error">{error}</div>}

//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>New Password</label>
//           <input
//             type="password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//         </div>
        
//         <div>
//           <label>Confirm New Password</label>
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </div>

//         <button type="submit" disabled={loading}>
//           {loading ? 'Resetting...' : 'Reset Password'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ResetPasswordPage;
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Updated Password Validation Regex
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._])[A-Za-z\d@$!%*?&._]{8,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(
        'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character (., _, @, $, !, %, *, ?, &).'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post(`/api/users/reset-password/${resetToken}`, {
        newPassword,
      });

      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter a strong password"
            required
          />
        </div>

        <div>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
