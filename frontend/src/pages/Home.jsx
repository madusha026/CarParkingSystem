import React  from 'react';
import './Home.css'; 

const Home = () => {

    return(
        <div className='home-container'>
            <header className="home-header">
            <nav className="navbar">
                <ul className="navbar-list">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about-us">About Us</a></li>
                    <li><a href="/detect-plate">Detect Plate</a></li>
                </ul>
            </nav>
            <h1>Welcome to Our Car Parking System</h1>
            <p>Welcome to our intelligent car parking system, where cutting-edge machine learning technology meets convenience and efficiency. Gone are the days of circling around looking for an available spot. Our system uses advanced machine learning models to detect real-time parking availability, ensuring that you can always find a spot quickly and easily. Whether you're entering the parking lot for the first time or returning for a regular visit, our seamless experience—powered by smart algorithms—guarantees a smooth and hassle-free parking experience. Our solution goes beyond just slot detection; it provides real-time tracking of your vehicle, stores your parking history, and even generates personalized QR codes for entry and exit. All designed to make your parking experience faster, smarter, and more efficient.</p>
            </header>
            <body> 
            {/* <div className="cta">
            <button onClick={() => window.location.href = '/slots'}>Check Available Slots</button>
            <button onClick={() => window.location.href = '/qr-scan'}>Scan QR Code</button>
            </div> */}
            </body>
            <footer>
            <p>&copy; 2025 Car Parking System. All Rights Reserved.</p>
            </footer>

        </div>
    )
}

export default Home;