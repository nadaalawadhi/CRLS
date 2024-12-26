// import React, { useState } from 'react'; 

// const ContactUs = () => {
//   const [formData, setFormData] = useState({ name: '', email: '', message: '' });
//   const [responseMessage, setResponseMessage] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Simulate form submission
//     setTimeout(() => {
//       setResponseMessage('Thank you for contacting us! We will get back to you soon.');
//       setFormData({ name: '', email: '', message: '' });
//     }, 1000);
//   };

//   return (
//     <div className="contact-us-page">
//       <h1>Contact Us</h1>
//       <p>We’d love to hear from you! Please fill out the form below, and our team will respond promptly.</p>

//       <form className="contact-form" onSubmit={handleSubmit}>
//         <label>
//           Name:
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </label>
//         <label>
//           Email:
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </label>
//         <label>
//           Message:
//           <textarea
//             name="message"
//             value={formData.message}
//             onChange={handleChange}
//             required
//           ></textarea>
//         </label>
//         <button type="submit">Submit</button>
//       </form>

//       {responseMessage && <p className="response-message">{responseMessage}</p>}
//     </div>
//   );
// };

// export default ContactUs;
import React from 'react';

const ContactUs = () => {
  return (
    <div className="contact-us-page">
      <h1>Contact Us</h1>
      <p>We’d love to hear from you! If you have any questions or need assistance, feel free to reach out using the contact information below.</p>
      
      <h2>Contact Information</h2>
      <p>
        <strong>Email:</strong> <a href="mailto:noreply.crls.bh@gmail.com">noreply.crls.bh@gmail.com</a>
      </p>
      <p>
        <strong>Phone:</strong> (+973) 3344-5555
      </p>

      <h2>Branch Locations</h2>
      <ul>
        <li><strong>Muharraq Branch:</strong> Located in the heart of Muharraq, we are here to serve you.</li>
        <li><strong>Riffa Branch:</strong> Conveniently situated in Riffa, ready to assist with your needs.</li>
        <li><strong>Manama Branch:</strong> Our main branch in Manama offers a full range of services.</li>
      </ul>

      <p>We look forward to hearing from you! Whether you have a question, feedback, or need support, our team is here to help.</p>
    </div>
  );
};

export default ContactUs;