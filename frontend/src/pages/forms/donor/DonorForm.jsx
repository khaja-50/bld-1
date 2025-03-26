import React, { useState, useEffect } from "react";
import "../FormStyles.css";
import MapComponent from "@/components/MapComponent"; // Ensure correct path
import countryData from "/src/data/countryData.json";

const DonorForm = () => {
  const [donor, setDonor] = useState({
    fullName: "",
    age: "",
    bloodType: "",
    lastDonationDate: "",
    donationGap: "",
    healthCondition: [],
    availabilityStart: "",
    availabilityEnd: "",
    country: "",
    state: "",
    district: "",
    contactNumber: "",
    location: { lat: null, lng: null },
  });

  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

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
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonor({ ...donor, [name]: value });

    if (name === "lastDonationDate") {
      const selectedDate = new Date(value);
      const today = new Date();
      const monthDiff =
        (today.getFullYear() - selectedDate.getFullYear()) * 12 +
        today.getMonth() - selectedDate.getMonth();
      setDonor((prev) => ({ ...prev, donationGap: monthDiff }));
    }
  };

  // ✅ Handle Health Condition Selection
  const handleHealthConditionChange = (e) => {
    const { value, checked } = e.target;

    if (value === "None of the Above") {
      setDonor((prev) => ({
        ...prev,
        healthCondition: checked ? ["None of the Above"] : [],
      }));
    } else {
      setDonor((prev) => {
        let updatedConditions = prev.healthCondition.filter((c) => c !== "None of the Above");

        if (checked) {
          updatedConditions.push(value);
        } else {
          updatedConditions = updatedConditions.filter((c) => c !== value);
        }

        return { ...prev, healthCondition: updatedConditions };
      });
    }
  };

  // ✅ Validate form inputs
  const validateForm = () => {
    let validationErrors = {};

    if (!donor.fullName.trim()) validationErrors.fullName = "Full Name is required.";
    if (!donor.age || isNaN(donor.age) || donor.age < 18 || donor.age > 65)
      validationErrors.age = "Age must be between 18 and 65.";
    if (!donor.bloodType) validationErrors.bloodType = "Please select a blood type.";
    if (donor.donationGap < 3) validationErrors.donationGap = "Minimum donation gap is 3 months.";

    // ❌ Prevent registration if donor has restricted health conditions
    const hasRestrictedCondition = donor.healthCondition.some((condition) =>
      restrictedConditions.includes(condition)
    );

    if (hasRestrictedCondition) {
      validationErrors.healthCondition = "You are not eligible to donate due to health conditions.";
    }

    if (!/^\d{10}$/.test(donor.contactNumber))
      validationErrors.contactNumber = "Enter a valid 10-digit phone number.";
    if (!donor.availabilityStart || !donor.availabilityEnd)
      validationErrors.availabilityTime = "Please select an availability time range.";

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

  // ✅ Prevent submission if validation fails
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
        {errors.fullName && <p className="error">{errors.fullName}</p>}

        <label>Age:</label>
        <input type="number" name="age" value={donor.age} onChange={handleChange} required />
        {errors.age && <p className="error">{errors.age}</p>}

        <label>Blood Type:</label>
        <select name="bloodType" value={donor.bloodType} onChange={handleChange} required>
          <option value="">Select Blood Type</option>
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.bloodType && <p className="error">{errors.bloodType}</p>}

        <label>Last Donation Date:</label>
        <input type="date" name="lastDonationDate" value={donor.lastDonationDate} onChange={handleChange} />

        <label>Donation Gap (months):</label>
        <input type="number" name="donationGap" value={donor.donationGap} readOnly />
        {errors.donationGap && <p className="error">{errors.donationGap}</p>}

        <label>Availability Time:</label>
        <input type="time" name="availabilityStart" value={donor.availabilityStart} onChange={handleChange} required />
        <input type="time" name="availabilityEnd" value={donor.availabilityEnd} onChange={handleChange} required />
        {errors.availabilityTime && <p className="error">{errors.availabilityTime}</p>}

        <label>Health Condition:</label>
        <div className="checkbox-group">
          {restrictedConditions.concat(["None of the Above"]).map((condition, index) => (
            <div key={index} className="checkbox-item">
              <input
                type="checkbox"
                value={condition}
                checked={donor.healthCondition.includes(condition)}
                onChange={handleHealthConditionChange}
              />
              <label>{condition}</label>
            </div>
          ))}
        </div>

        {errors.healthCondition && <p className="error">{errors.healthCondition}</p>}

        <label>Contact Number:</label>
        <input type="text" name="contactNumber" value={donor.contactNumber} onChange={handleChange} required />

        <label>Location:</label>
        <MapComponent location={donor.location} setLocation={(newLocation) => setDonor({ ...donor, location: newLocation })} />

        <button type="submit">Register as Donor</button>
      </form>
    </div>
  );
};

export default DonorForm;
