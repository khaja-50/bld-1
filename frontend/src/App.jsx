import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Info from "./pages/info/Info";
import ForgotPassword from "./pages/forgotpassword/ForgotPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import ReceiverForm from "./pages/forms/receiver/ReceiverForm"; 
import DonorForm from "./pages/forms/donor/DonorForm";
import Home from "./pages/home/home";  // Fixed casing issue
import ProfilePage from "./pages/profile/ProfilePage";  // Correct import of ProfilePage

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/info" element={<Info />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/receiver-form" element={<ReceiverForm />} />
        <Route path="/donor-form" element={<DonorForm />} />
        <Route path="/profile" element={<ProfilePage />} />  {/* ✅ ProfilePage is now correctly referenced */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
