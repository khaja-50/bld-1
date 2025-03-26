import React from "react";
import { Link } from "react-router-dom";
import "./HomeStyles.css"; // Add a CSS file for styling

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <h2>Welcome to Blood Donation Portal</h2>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/receiver-form">Request Blood</Link></li>
          <li><Link to="/donor-form">Donate Blood</Link></li>
          <li><Link to="/login" className="logout-btn">Logout</Link></li>
        </ul>
      </nav>

      <div className="home-content">
        <h1>Hello, User! 👋</h1>
        <p>Welcome to the Blood Donation Management System.</p>
        <p>Here you can request blood, donate blood, and manage your profile.</p>
        
        <div className="quick-links">
          <Link to="/receiver-form" className="card">Need Blood? Request Now</Link>
          <Link to="/donor-form" className="card">Become a Donor</Link>
          <Link to="/dashboard" className="card">View Dashboard</Link>
          <Link to="/profile" className="card">Manage Your Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
