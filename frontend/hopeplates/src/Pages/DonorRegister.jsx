// DonorRegister.jsx
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerDonor } from "../services/api";

function DonorRegister() {
  const [formData, setFormData] = useState({
    username: "", // ✅ ADD THIS
    password: "",
    email: "",
    address: "",
    phone: "",
    donor_type: "Individual"
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting formData:", formData);

    try {
      const response = await registerDonor(formData);
      console.log("Registration successful:", response.data);
      setErrorMessage(""); // clear error
      setSuccessMessage("Registration successful! Redirecting to home_page...");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/donor-home");
      }, 2000);
    } catch (error) {
      const data = error.response?.data;
      if (data?.username?.[0]) {
        setErrorMessage(data.username[0]);
      } else if (data?.email?.[0]) {
        setErrorMessage(data.email[0]);
      } else if (data?.error) {
        setErrorMessage(data.error);
      } else {
        setErrorMessage("Registration failed");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-[#af97b6]">
      <div className="bg-white shadow-lg rounded-lg flex w-[60%] p-8">
        {/* Left Section - Form */}
        <div className="w-1/2 flex flex-col justify-center px-6">
          <div className="flex items-center justify-center mb-5">
            <FaUser className="text-black text-3xl mr-2" />
            <h1 className="text-3xl font-bold text-[#410c31]">
              Donor Registration
            </h1>
          </div>

          {successMessage && (
            <p className="text-green-600 font-semibold text-center mb-2">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="text-red-600 font-semibold text-center mb-2">
              {errorMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border border-[#410c31] rounded-lg px-3 py-2">
              <FaBuilding className="text-gray-600 mr-2" />
              <select
                name="donor_type"
                value={formData.donor_type}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
                required
              >
                <option value="">Select Donor Type</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Hotel">Hotel</option>
                <option value="Bakery">Bakery</option>
                <option value="Individual">Individual</option>
              </select>
            </div>

            <div className="flex items-center border border-[#410c31] rounded-lg px-3 py-2">
              <FaUser className="text-gray-600 mr-2" />
              <input
                type="text"
                name="username"
                placeholder="Business/Organization Name"
                className="w-full outline-none bg-transparent"
                value={formData.username} // ✅ Correct
                onChange={handleChange}
                required
              />

            </div>

            <div className="flex items-center border border-[#410c31] rounded-lg px-3 py-2">
              <FaEnvelope className="text-gray-600 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full outline-none bg-transparent"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center border border-[#410c31] rounded-lg px-3 py-2">
              <FaPhone className="text-gray-600 mr-2" />
              <input
                type="tel"
                name="phone"
                placeholder="Contact Number"
                className="w-full outline-none bg-transparent"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-start border border-[#410c31] rounded-lg px-3 py-2">
              <FaMapMarkerAlt className="text-gray-600 mr-2 mt-1" />
              <textarea
                name="address"
                placeholder="Enter your location..."
                className="w-full outline-none bg-transparent resize-none"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="flex items-center border border-[#410c31] rounded-lg px-3 py-2">
              <FaLock className="text-gray-600 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Password (min 8 characters)"
                className="w-full outline-none bg-transparent"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#410c31] text-white px-6 py-3 mt-4 rounded-lg font-semibold shadow-md hover:bg-[#2b081f]"
            >
              Register
            </button>
          </form>

          <p
            className="mt-4 text-center text-black hover:underline hover:text-[#2b081f] cursor-pointer"
            onClick={() => navigate("/donor-login")}
          >
            Already have an account? Login
          </p>
        </div>

        <div className="w-1/2 flex justify-center items-center">
          <img src="/don_reg.jpeg" alt="Illustration" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
}

export default DonorRegister;
