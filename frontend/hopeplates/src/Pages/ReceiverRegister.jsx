import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ReceiverRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    orgType: "",
    orgName: "",
    email: "",
    contact: "",
    location: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/register-receiver/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_type: formData.orgType,
          organization_name: formData.orgName,
          email: formData.email,
          contact_number: formData.contact,
          location: formData.location,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful!");
        setError("");
        alert("Registration successful!");
        navigate("/receiver-login");
      } else {
        console.error(data);
        setError("Registration failed. Please check the details or try again.");
        setSuccess("");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Try again later.");
      setSuccess("");
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-[#98b0d9]">
      <div className="bg-white shadow-lg rounded-lg flex w-[60%] p-8">
        {/* Left - Form */}
        <div className="w-1/2 flex flex-col justify-center px-6">
          <div className="flex items-center justify-center mb-5">
            <FaUser className="text-black text-3xl mr-2" />
            <h1 className="text-3xl font-bold text-[#0e2843]">Receiver Registration</h1>
          </div>

          <div className="space-y-4">
            {/* Organization Type Dropdown */}
            <div className="flex items-center border border-[#0e2843] rounded-lg px-3 py-2">
              <FaBuilding className="text-gray-600 mr-2" />
              <select
                name="orgType"
                value={formData.orgType}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
              >
                <option value="">Select Organization Type</option>
                <option value="NGO">NGO</option>
                <option value="Shelter">Shelter</option>
                <option value="Food Bank">Food Bank</option>
                <option value="Community Kitchen">Community Kitchen</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Organization Name */}
            <div className="flex items-center border border-[#0e2843] rounded-lg px-3 py-2">
              <FaUser className="text-gray-600 mr-2" />
              <input
                type="text"
                name="orgName"
                value={formData.orgName}
                onChange={handleChange}
                placeholder="Organization Name"
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* Email */}
            <div className="flex items-center border border-[#0e2843] rounded-lg px-3 py-2">
              <FaEnvelope className="text-gray-600 mr-2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* Contact Number */}
            <div className="flex items-center border border-[#0e2843] rounded-lg px-3 py-2">
              <FaPhone className="text-gray-600 mr-2" />
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Contact Number"
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* Location */}
            <div className="flex items-start border border-[#0e2843] rounded-lg px-3 py-2">
              <FaMapMarkerAlt className="text-gray-600 mr-2 mt-1" />
              <textarea
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location..."
                className="w-full outline-none bg-transparent resize-none"
                rows="2"
              />
            </div>

            {/* Password */}
            <div className="flex items-center border border-[#0e2843] rounded-lg px-3 py-2">
              <FaLock className="text-gray-600 mr-2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Register Button */}
          <button
            className="w-full bg-[#0e2843] text-white px-6 py-3 mt-4 rounded-lg font-semibold shadow-md hover:bg-[#091b2d]"
            onClick={handleRegister}
          >
            Register
          </button>

          {/* Error or Success Message */}
          {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
          {success && <p className="text-green-600 mt-2 text-sm">{success}</p>}

          {/* Already have account? */}
          <p
            className="mt-4 text-center text-black hover:underline hover:text-[#091b2d] cursor-pointer"
            onClick={() => navigate("/receiver-login")}
          >
            Already have an account? Login
          </p>
        </div>

        {/* Right - Image */}
        <div className="w-1/2 flex justify-center items-center">
          <img src="/rec_reg.jpeg" alt="Receiver Registration Illustration" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
}

export default ReceiverRegister;
