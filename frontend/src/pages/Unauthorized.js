// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const Unauthorized = () => {
//   const navigate = useNavigate();

//   return (
//     <div>
//       <h1>Access Denied</h1>
//       <p>You do not have permission to view this page.</p>
//       <button onClick={() => navigate(-1)}>Go Back</button>
//     </div>
//   );
// };

// export default Unauthorized;
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.header}>Access Denied</h1>
        <p style={styles.message}>You do not have permission to view this page.</p>
        {/* <button style={styles.button} onClick={() => navigate(-1)}>
          Go Back
        </button> */}
        <button style={styles.button} onClick={() => navigate('/')}>
            Go to Home
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '530px',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
  },
  content: {
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
  },
  header: {
    fontSize: '2rem',
    color: '#e74c3c',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1rem',
    color: '#6c757d',
    marginBottom: '1.5rem',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#16a085',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

styles.buttonHover = {
  ...styles.button,
  backgroundColor: '#0056b3',
};

export default Unauthorized;
