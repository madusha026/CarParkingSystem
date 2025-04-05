// frontend/src/pages/AboutUs.js
import React from 'react';
import './AboutUs.css';  // Make sure the CSS file is imported

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h1>About Us</h1>
      <p>
        Our Car Parking System uses cutting-edge AI and machine learning technologies to make parking smarter and more efficient. Our advanced algorithms allow for real-time parking availability detection, making parking faster and easier for everyone.
      </p>
      <h2>Our Mission</h2>
      <p>
        Our mission is to revolutionize the parking experience with smart, data-driven solutions. We aim to eliminate the hassle of searching for parking spots, optimize the usage of available spaces, and provide a seamless experience from entry to exit.
      </p>
      <h2>Our Vision</h2>
      <p>
        We envision a future where parking is stress-free, efficient, and eco-friendly, contributing to smarter cities with better traffic management and less congestion.
      </p>
      <footer>
        <p>&copy; 2025 Car Parking System. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default AboutUs;
