import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import RegisterButton from "../Components/Registerbutton";
import axios from "axios";

function ReceiverLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/donors/login/", {
        email,
        password,
      });
  
      const accessToken = response.data.access;
      localStorage.removeItem("access_token"); // Clear donor token
      localStorage.setItem("receiverToken", accessToken); // Save receiver token
  
      console.log("Receiver login success:", response.data);
      navigate("/receiver-home");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-[#98b0d9]">
      <div className="flex bg-white rounded-lg shadow-lg w-[70%] p-8">
        
        {/* Left Side - Login Form */}
        <div className="w-1/2 text-center p-5">
          <div className="flex items-center justify-center gap-2 mb-5">
            <FaUser className="text-black text-4xl" />
            <h1 className="text-3xl font-bold text-[#0e2843]">Receiver Login</h1>
          </div>

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white text-black px-3 py-3 border border-[#0e2843] rounded-lg mb-4 focus:ring-0 focus:outline-none"
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white text-black px-3 py-3 border border-[#0e2843] rounded-lg mb-4 focus:ring-0 focus:outline-none"
          />

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          {/* Login Button */}
          <button 
            className="w-full bg-[#0e2843] text-white px-5 py-3 rounded-lg font-semibold shadow-md hover:bg-[#091b2d]"
            onClick={handleLogin}
          >
            Login
          </button>

          {/* Register Button */}
          <RegisterButton userType="receiver" />

          {/* Back Button */}
          <button 
            className="mt-4 bg-white text-[#0e2843] border-2 border-black px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 focus:ring-0 focus:outline-none"
            onClick={() => navigate("/")}
          >
            Back to Welcome
          </button>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 flex justify-center items-center">
          <img src="/rec_log.jpeg" alt="Receiver Login Illustration" className="w-[90%] h-auto" />
        </div>
      </div>
    </div>
  );
}

export default ReceiverLogin;
