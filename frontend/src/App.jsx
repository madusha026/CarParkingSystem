import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';        // Import Home page
import AboutUs from './pages/Aboutus';  // Import AboutUs page
import './App.css';                    // Import styles

function App() {
  return (
    <Router>  {/* Set up Router to handle routing */}
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
