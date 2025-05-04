import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReceiverSidebar from "../Components/ReceiverSidebar";

const AddDeliveryPartner = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact_number: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("receiverToken");

    if (!token) {
      setError("You must be logged in as a receiver to add a delivery partner.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/add-delivery-partner/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Delivery partner added successfully!");
        setFormData({ name: "", contact_number: "", location: "" });

        setTimeout(() => {
          navigate("/contact-delivery");
        }, 1500);
      } else {
        throw new Error(data.message || "Failed to add delivery partner.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex">
      <ReceiverSidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">Add Delivery Partner</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <form
          onSubmit={handleSubmit}
          className="max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Contact Number</label>
            <input
              type="text"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ➕ Add Partner
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDeliveryPartner;
