import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#cdcfc9]">
      {/* Shifted Right Content */}
      <div className="flex flex-col items-center text-center space-y-7 bg-white shadow-lg p-12 rounded-lg">
        {/* Logo */}
        <img src="./logo1.png" alt="HopePlates Logo" className="w-50 h-40" />

        {/* Heading */}
        <h1 className="text-black text-6xl font-bold">Welcome to HopePlates</h1>
        <p className="text-black text-lg">Bridging surplus food to those in need.</p>

        {/* Buttons */}
        <div className="flex gap-7">
          <button
            onClick={() => navigate("/donor-login")}
            className="w-64 bg-[#410c31] text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform duration-200 hover:scale-110 hover:bg-[#2b081f]"
          >
            I am a Donor
          </button>

          <button
            onClick={() => navigate("/receiver-login")}
            className="w-64 bg-[#0e2843] text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform duration-200 hover:scale-110 hover:bg-[#091b2c]"
          >
            I am a Receiver
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
