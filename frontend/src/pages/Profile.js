import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false); // Tracks if fields are editable
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // State for success modal
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please log in');
          setLoading(false);
          return;
        }

        const userId = JSON.parse(localStorage.getItem('user')).id;

        const response = await axios.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // const handleSaveChanges = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       setError('No token found, please log in');
  //       return;
  //     }

  //     const userId = JSON.parse(localStorage.getItem('user')).id;

  //     await axios.put(`/api/users/${userId}`, userDetails, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     // Open success modal with a message
  //     setSuccessMessage('Profile updated successfully!');
  //     setIsSuccessModalOpen(true);
  //     setIsEditing(false); // Disable editing after saving
  //   } catch (error) {
  //     setError('Error updating profile');
  //   }
  // };
  const handleSaveChanges = async () => {
    setError(null);
    setLoading(true);
  
    // Field validations
    if (!/^[a-zA-Z]{2,50}$/.test(userDetails.firstName)) {
      setError('First name must be 2-50 alphabetic characters.');
      setLoading(false);
      return;
    }
  
    if (!/^[a-zA-Z]{2,50}$/.test(userDetails.lastName)) {
      setError('Last name must be 2-50 alphabetic characters.');
      setLoading(false);
      return;
    }
  
    if (!/^\S+@\S+\.\S+$/.test(userDetails.email)) {
      setError('Invalid email format.');
      setLoading(false);
      return;
    }
  
    if (!/^\d{8}$/.test(userDetails.phoneNumber)) {
      setError('Phone number must be exactly 8 digits.');
      setLoading(false);
      return;
    }
  
    if (userDetails.address.length < 10 || userDetails.address.length > 200) {
      setError('Address must be between 10 and 200 characters.');
      setLoading(false);
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in');
        setLoading(false);
        return;
      }
  
      const userId = JSON.parse(localStorage.getItem('user')).id;
  
      await axios.put(`/api/users/${userId}`, userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setSuccessMessage('Profile updated successfully!');
      setIsSuccessModalOpen(true);
      setIsEditing(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Display backend error message
      } else if (error.response && error.response.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Error updating profile');
      }
    } finally {
      setLoading(false);
    }
  };
  

  
  const handleEditClick = () => {
    if (isEditing) {
      // Save changes if the user clicks "Save Changes"
      handleSaveChanges();
    } else {
      // Enable editing if the user clicks "Edit Profile"
      setIsEditing(true);
    }
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage('');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      {error && <p className="error">{error}</p>}
      <section>
        <h2>Profile Information</h2>
        <form>
          <div>
            <label>First Name</label>
            <input
              type="text"
              value={userDetails.firstName}
              onChange={(e) => setUserDetails({ ...userDetails, firstName: e.target.value })}
              placeholder="First Name"
              disabled={!isEditing} // Disable input if not editing
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              value={userDetails.lastName}
              onChange={(e) => setUserDetails({ ...userDetails, lastName: e.target.value })}
              placeholder="Last Name"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={userDetails.email}
              onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
              placeholder="Email"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="text"
              value={userDetails.phoneNumber}
              onChange={(e) => setUserDetails({ ...userDetails, phoneNumber: e.target.value })}
              placeholder="Phone Number"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              value={userDetails.address}
              onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
              placeholder="Address"
              disabled={!isEditing}
            />
          </div>
        </form>
        <button onClick={handleEditClick}>
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </section>
      <section>
        <button onClick={() => navigate('/changePassword')}>Change Password</button>
      </section>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <Modal
          isOpen={isSuccessModalOpen}
          onRequestClose={closeSuccessModal}
          className="success-modal"
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

export default ProfilePage;
