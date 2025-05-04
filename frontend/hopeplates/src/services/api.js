import axios from "axios";

// Donor Registration API
export const registerDonor = async (formData) => {
  const payload = {
    donor_type: formData.donor_type,
    username: formData.username,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    password: formData.password,
  };

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/donors/register/",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data);

    // Re-throw structured error data so frontend can use it
    if (error.response && error.response.data) {
      throw error; // pass original error to caller
    } else {
      throw new Error("Registration failed. Please try again.");
    }
  }
};

// Fetch Nearby Donations API
export const fetchNearbyDonations = async (lat, lng) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/nearby-donations/?lat=${lat}&lng=${lng}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch nearby donations.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch Nearby Donations Error:", error.message);
    throw error;
  }
};
