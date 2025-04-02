import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <header>
        <h1>About Us</h1>
      </header>
      <section>
        <h2>Our Vision</h2>
        <p>We aim to revolutionize parking by providing an easy-to-use, smart, and efficient parking management system powered by machine learning.</p>
        
        <h2>How It Works</h2>
        <p>Our system uses cutting-edge ML models to detect available parking slots and automatically register vehicles as they enter the parking lot. Customers can scan a QR code for easy entry and exit.</p>

        <h2>Technology Behind the System</h2>
        <p>We integrate state-of-the-art machine learning models for vehicle number plate detection and slot management, ensuring optimal parking efficiency.</p>
      </section>
      <footer>
        <p>&copy; 2025 Car Parking System</p>
      </footer>
    </div>
  );
}

export default AboutUs;
