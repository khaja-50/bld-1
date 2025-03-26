import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Import Home.css
import "./HomeStyles.css"; // Import HomeStyles.css

const Home = () => {
  return (
    <div className="home-container">
      {/* Navbar */}
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

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Hello, User! 👋</h1>
          <p className="hero-subtitle">
            Welcome to the Blood Donation Management System.<br />
            Request blood, donate blood, and manage your profile.
          </p>

          {/* Quick Links */}
          <div className="quick-links">
            <Link to="/receiver-form" className="card">Need Blood? Request Now</Link>
            <Link to="/donor-form" className="card">Become a Donor</Link>
            <Link to="/dashboard" className="card">View Dashboard</Link>
            <Link to="/profile" className="card">Manage Your Profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
