import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReceiverSidebar from '../Components/ReceiverSidebar';

const AddShelter = () => {
  const [name, setName] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const shelterData = {
      name,
      number_of_people: parseInt(numberOfPeople),
      address,
      contact_number: contactNumber,
    };

    try {
      const token = localStorage.getItem('receiverToken');
      if (!token) {
        setError('You are not authenticated!');
        setLoading(false);
        return;
      }

      await axios.post(
        'http://localhost:8000/api/add-shelter/',
        shelterData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Shelter added successfully');
      navigate('/receiver-home');
    } catch (err) {
      console.error(err);
      setError('Error adding shelter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ReceiverSidebar />

      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl mx-auto mt-10">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Add a Shelter</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg text-gray-700 font-semibold">Shelter Name</label>
              <input
                type="text"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter shelter name"
              />
            </div>

            <div>
              <label className="block text-lg text-gray-700 font-semibold">Number of People</label>
              <input
                type="number"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
                required
                placeholder="Enter number of people"
              />
            </div>

            <div>
              <label className="block text-lg text-gray-700 font-semibold">Address</label>
              <input
                type="text"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Enter shelter address"
              />
            </div>

            <div>
              <label className="block text-lg text-gray-700 font-semibold">Contact Number</label>
              <input
                type="tel"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                placeholder="Enter contact number"
              />
            </div>

            {loading ? (
              <p className="text-center text-gray-700">Please wait...</p>
            ) : (
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out"
              >
                Add Shelter
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddShelter;
