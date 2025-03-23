import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Info from "./pages/info/Info";
import ForgotPassword from "./pages/forgotpassword/ForgotPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import ReceiverForm from "./pages/forms/receiver/ReceiverForm"; // Receiver Form
import DonorForm from "./pages/forms/donor/DonorForm"; // Donor Form
import Profile from "./pages/profile/profile"; // Profile Page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/info" element={<Info />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/receiver-form" element={<ReceiverForm />} />
        <Route path="/donor-form" element={<DonorForm />} />
        <Route path="/profile" element={<Profile />} /> {/* ✅ Added Profile Route */}
      </Routes>
    </Router>
  );
};

export default App;
