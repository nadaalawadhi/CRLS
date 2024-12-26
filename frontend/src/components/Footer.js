import React from "react";

const Footer = () => {
  return (
    <footer>
      <div>
        <div>
          <a href="/about-us" >About Us</a>
          <a href="/terms-and-conditions" >Terms & Conditions</a>
          <a href="/privacy-policy" >Privacy Policy</a>
          <a href="/contact-us" >Contact Us</a>
        </div>
        <div>
          <p>&copy; {new Date().getFullYear()} Nada Alawadhi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
