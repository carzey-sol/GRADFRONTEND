"use client"; // Ensure client-side rendering for React hooks and effects

import React, { useEffect, useState } from 'react';
import Dashnav from "@/app/components/dashnav";
import TeacherNav from "../teacherNav";
import Loading from "../../components/loading";

const Subjects = ({ universityName, universityInitials }) => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    status: 'pending',
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const universityId = localStorage.getItem('universityId'); // Get university ID from localStorage
    try {
      const response = await fetch(`http://localhost:4000/api/addComplaints/getcomp?university_id=${universityId}`);
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleUpdate = (complaint) => {
    setSelectedComplaint(complaint);
    setFormData({
      id: complaint.id,
      title: complaint.title,
      description: complaint.description,
      status: complaint.status,
    });
    setShowUpdateForm(true);
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      title: '',
      description: '',
      status: 'pending',
    });
    setShowAddForm(true);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    const universityId = localStorage.getItem('universityId'); // Get university ID from localStorage
    try {
      await fetch(`http://localhost:4000/api/addComplaints/complaints/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, university_id: universityId }),
      });
      fetchComplaints();
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Error updating complaint:', error);
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    const universityId = localStorage.getItem('universityId'); // Get university ID from localStorage
    try {
      await fetch('http://localhost:4000/api/addComplaints/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, university_id: universityId }),
      });
      fetchComplaints();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding complaint:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="flex">
        <Dashnav universityName={universityName} universityInitials={universityInitials} />
        <TeacherNav />
      </div>

      <div>
        <div>
          <div className="flex ml-80 mt-32 justify-center item">
            <h1 className="text-xl uppercase font-bold bg-green-500 p-2 text-white">Complaints Management</h1>
          </div>
          <div className="ml-80 flex mt-12 flex-col">
            {complaints.map(complaint => (
              <div key={complaint.id} className="p-4 border rounded shadow flex justify-between items-center w-full mb-4">
                <h1>{complaint.title}</h1>
                <div className='flex gap-10'>
                  <button
                    className='bg-blue-500 p-2 rounded font-bold text-white'
                    onClick={() => handleViewDetails(complaint)}
                  >
                    View Details
                  </button>
                  <button
                    className='bg-green-500 p-2 rounded font-bold text-white'
                    onClick={() => handleUpdate(complaint)}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='fixed bottom-10 right-10'>
          <button
            className='bg-green-500 rounded p-2 font-bold text-white uppercase'
            onClick={handleAdd}
          >
            Add Complaint
          </button>
        </div>
      </div>

      {selectedComplaint && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Complaint Details</h2>
            <p><strong>ID:</strong> {selectedComplaint.id}</p>
            <p><strong>Title:</strong> {selectedComplaint.title}</p>
            <p><strong>Description:</strong> {selectedComplaint.description}</p>
            <p><strong>Status:</strong> {selectedComplaint.status}</p>
            <button
              className='bg-gray-500 p-2 rounded text-white'
              onClick={() => setSelectedComplaint(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showUpdateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <form className="bg-white p-6 rounded shadow-lg" onSubmit={handleSubmitUpdate}>
            <h2 className="text-xl font-bold mb-4">Update Complaint</h2>
            <label className="block mb-2">
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              Description:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-4">
              Status:
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border p-2 w-full"
              >
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <button
              type="submit"
              className="bg-green-500 p-2 rounded text-white"
            >
              Update
            </button>
            <button
              type="button"
              className="bg-gray-500 p-2 rounded text-white ml-2"
              onClick={() => setShowUpdateForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <form className="bg-white p-6 rounded shadow-lg" onSubmit={handleSubmitAdd}>
            <h2 className="text-xl font-bold mb-4">Add Complaint</h2>
            <label className="block mb-2">
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              Description:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-4">
              Status:
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border p-2 w-full"
              >
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <button
              type="submit"
              className="bg-green-500 p-2 rounded text-white"
            >
              Add
            </button>
            <button
              type="button"
              className="bg-gray-500 p-2 rounded text-white ml-2"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Subjects;
