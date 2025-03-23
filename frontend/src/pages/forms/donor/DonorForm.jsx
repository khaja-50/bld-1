import React, { useState, useEffect } from "react";
import "../FormStyles.css";
import countryData from "/src/data/countryData.json";

const DonorForm = () => {
  const [donor, setDonor] = useState({
    fullName: "",
    age: "",
    bloodType: "",
    lastDonationDate: "",
    donationGap: "",
    healthCondition: [],
    country: "",
    state: "",
    district: "",
    contactNumber: "",
  });

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const restrictedConditions = [
    "HIV",
    "Hepatitis B",
    "Hepatitis C",
    "Cancer",
    "Heart Disease",
    "Kidney Disease",
    "Tuberculosis",
    "Diabetes (on insulin)",
    "Recent Surgery",
    "Malaria (in last 3 months)",
    "Pregnancy",
    "None of the Above",
  ];

  // Handle input changes
  const handleChange = (e) => {
    setDonor({ ...donor, [e.target.name]: e.target.value });

    // Auto-calculate donation gap when last donation date is selected
    if (e.target.name === "lastDonationDate") {
      const selectedDate = new Date(e.target.value);
      const today = new Date();
      const monthDiff = (today.getFullYear() - selectedDate.getFullYear()) * 12 + today.getMonth() - selectedDate.getMonth();
      setDonor((prev) => ({ ...prev, donationGap: monthDiff }));
    }
  };

  // Handle health condition selection in dropdown checklist
  const handleCheckboxChange = (condition) => {
    let updatedConditions = [...donor.healthCondition];

    if (condition === "None of the Above") {
      updatedConditions = ["None of the Above"];
    } else {
      if (updatedConditions.includes("None of the Above")) {
        updatedConditions = [];
      }

      if (updatedConditions.includes(condition)) {
        updatedConditions = updatedConditions.filter((c) => c !== condition);
      } else {
        updatedConditions.push(condition);
      }
    }

    setDonor({ ...donor, healthCondition: updatedConditions });
  };

  // Validate form fields
  const validateForm = () => {
    let validationErrors = {};

    if (donor.age < 18 || donor.age > 65) {
      validationErrors.age = "Age must be between 18 and 65.";
    }

    if (donor.donationGap < 3) {
      validationErrors.donationGap = "Minimum donation gap is 3 months.";
    }

    if (donor.healthCondition.length === 0) {
      validationErrors.healthCondition = "Please select at least one option.";
    } else if (donor.healthCondition.some((condition) => condition !== "None of the Above")) {
      validationErrors.healthCondition = "Individuals with these conditions are not eligible for blood donation.";
    }

    if (!/^\d{10}$/.test(donor.contactNumber)) {
      validationErrors.contactNumber = "Enter a valid 10-digit phone number.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Update states when a country is selected
  useEffect(() => {
    if (donor.country) {
      const selectedCountry = countryData.find((c) => c.name === donor.country);
      setStates(selectedCountry ? selectedCountry.states : []);
      setDonor((prev) => ({ ...prev, state: "", district: "" }));
    }
  }, [donor.country]);

  // Update districts when a state is selected
  useEffect(() => {
    if (donor.state) {
      const selectedState = states.find((s) => s.name === donor.state);
      setDistricts(selectedState ? selectedState.districts : []);
      setDonor((prev) => ({ ...prev, district: "" }));
    }
  }, [donor.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Donor Details:", donor);
      alert("Thank you for registering as a donor!");
    }
  };

  return (
    <div className="form-container">
      <h2>Blood Donor Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input type="text" name="fullName" value={donor.fullName} onChange={handleChange} required />

        <label>Age:</label>
        <input type="number" name="age" value={donor.age} onChange={handleChange} required />
        {errors.age && <p className="error">{errors.age}</p>}

        <label>Blood Type:</label>
        <select name="bloodType" value={donor.bloodType} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <label>Last Donation Date:</label>
        <input type="date" name="lastDonationDate" value={donor.lastDonationDate} onChange={handleChange} required />

        <label>Gap Since Last Donation (in months):</label>
        <input type="number" name="donationGap" value={donor.donationGap} readOnly />
        {errors.donationGap && <p className="error">{errors.donationGap}</p>}

        <label>Health Condition:</label>
        <div className="dropdown">
          <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {donor.healthCondition.length > 0 ? donor.healthCondition.join(", ") : "Select"}
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {restrictedConditions.map((condition, index) => (
                <label key={index} className="dropdown-item">
                  <input type="checkbox" value={condition} checked={donor.healthCondition.includes(condition)} onChange={() => handleCheckboxChange(condition)} />
                  {condition}
                </label>
              ))}
            </div>
          )}
        </div>
        {errors.healthCondition && <p className="error">{errors.healthCondition}</p>}

        <label>Country:</label>
        <select name="country" value={donor.country} onChange={handleChange} required>
          <option value="">Select</option>
          {countryData.map((country, index) => (
            <option key={index} value={country.name}>{country.name}</option>
          ))}
        </select>

        <label>State:</label>
        <select name="state" value={donor.state} onChange={handleChange} required disabled={!donor.country}>
          <option value="">Select</option>
          {states.map((state, index) => (
            <option key={index} value={state.name}>{state.name}</option>
          ))}
        </select>

        <label>District:</label>
        <select name="district" value={donor.district} onChange={handleChange} required disabled={!donor.state}>
          <option value="">Select</option>
          {districts.map((district, index) => (
            <option key={index} value={district}>{district}</option>
          ))}
        </select>

        <label>Contact Number:</label>
        <input type="text" name="contactNumber" value={donor.contactNumber} onChange={handleChange} required />
        {errors.contactNumber && <p className="error">{errors.contactNumber}</p>}

        <button type="submit">Register as Donor</button>
      </form>
    </div>
  );
};

export default DonorForm;
