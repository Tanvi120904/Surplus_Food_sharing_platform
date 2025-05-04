import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterButton = ({ userType }) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    if (userType === "donor") {
      navigate("/donor-register");
    } else if (userType === "receiver") {
      navigate("/receiver-register");
    }
  };

  return (
    <p className="mt-3 text-sm text-gray-700">
      Don't have an account?{" "}
      <button
        className="text-[#410c31] font-semibold underline hover:text-[#2b081f]"
        onClick={handleRegister}
      >
        Register here
      </button>
    </p>
  );
};

export default RegisterButton;
