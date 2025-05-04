import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import DonorSidebar from "../Components/DonorSidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationMarker = ({ setAddress }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
      )
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.display_name);
        });
    },
  });

  return position ? <Marker position={position} /> : null;
};

const AddDonation = () => {
  const [formData, setFormData] = useState({
    foodName: "",
    quantity: "",
    description: "",
    contactNumber: "",
    pickupAddress: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const donationData = {
      food_item: formData.foodName,
      quantity: formData.quantity,
      pickup_location: formData.pickupAddress,
      description: formData.description,
      contact_number: formData.contactNumber,
    };
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to submit a donation.");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/donations/",
        donationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Donation submitted successfully!");
      navigate("/donor-home");
    } catch (error) {
      console.error("Donation submission failed:", error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in again.");
      } else {
        toast.error("Failed to submit donation. Please try again.");
      }
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <DonorSidebar active="add-donation" />
      <div className="flex-1 bg-gray-100 p-6 overflow-hidden flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-[#3a003c] text-center mb-4">
          Add Donation
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md overflow-auto max-h-[80vh] space-y-3"
        >
          <input
            type="text"
            name="foodName"
            placeholder="Food Name *"
            value={formData.foodName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="quantity"
            placeholder="Quantity *"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number *"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="pickupAddress"
            placeholder="Pickup Address (or click on map) *"
            value={formData.pickupAddress}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            className="h-40 rounded z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker
              setAddress={(addr) =>
                setFormData({ ...formData, pickupAddress: addr })
              }
            />
          </MapContainer>

          <button
            type="submit"
            className="w-full bg-[#3a003c] text-white py-2 rounded font-semibold"
          >
            Submit Donation
          </button>
        </form>

        <div className="text-center mt-4 text-[#3a003c] text-sm">
          <p className="font-semibold">
            ❤️ “No one has ever become poor by giving.”
          </p>
          <p className="mt-1">
            Each meal you donate can bring hope and comfort to someone in need.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddDonation;
