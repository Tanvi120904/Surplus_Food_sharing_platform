import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RegisterButton from "../Components/Registerbutton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DonorLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/donors/login/", {
        email: email,
        password: password,
      });

      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;
      const donorId = response.data.user_id;

      // ✅ Save access & refresh tokens properly
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("donor_id", donorId);

      toast.success("Login successful!");
      navigate("/donor-home");
    } catch (error) {
      if (error.response) {
        console.error("Login failed:", error.response.data);
        setError(error.response?.data?.detail || "Invalid credentials.");
      } else {
        console.error("Login error:", error);
        setError("Something went wrong. Check console.");
      }
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-[#917b97]">
      <div className="flex bg-white rounded-lg shadow-lg w-[70%] p-8">
        <div className="w-1/2 text-center p-5">
          <div className="flex items-center justify-center gap-2 mb-5">
            <FaUser className="text-black text-4xl" />
            <h1 className="text-3xl font-bold text-[#410c31]">Donor Login</h1>
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-white text-black px-3 py-3 border border-[#410c31] rounded-lg mb-4"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-white text-black px-3 py-3 border border-[#410c31] rounded-lg mb-4"
          />

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <button
            className="w-full bg-[#410c31] text-white px-5 py-3 rounded-lg font-semibold shadow-md hover:bg-[#2b081f]"
            onClick={handleLogin}
          >
            Login
          </button>

          <RegisterButton userType="donor" />

          <button
            className="mt-4 bg-white text-[#410c31] border-2 border-black px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200"
            onClick={() => navigate("/")}
          >
            Back to Welcome
          </button>
        </div>

        <div className="w-1/2 flex justify-center items-center">
          <img src="/don_log.jpeg" alt="Donor Illustration" className="w-[90%] h-auto" />
        </div>
      </div>
    </div>
  );
}

export default DonorLogin;
