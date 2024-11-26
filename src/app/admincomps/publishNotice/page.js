"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashnav from "../../components/dashnav";
import AdminSideNav from "../page";
import Modal from "../../components/noticepopup"; // Ensure the path is correct

const PublishNotice = ({ universityName, universityInitials }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newNotice, setNewNotice] = useState({
    notice_title: '',
    notice_body: '',
    university_id: '',
  });
  const [editNotice, setEditNotice] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      const universityId = localStorage.getItem('universityId'); // Get university_id from local storage
      if (!universityId) {
        setError('University ID not found in local storage');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:4000/api/getNotices/notices/${universityId}`);
        setNotices(response.data);
      } catch (error) {
        console.error('Error fetching notices:', error);
        setError('Error fetching notices');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const openAddForm = () => {
    setNewNotice({
      notice_title: '',
      notice_body: '',
      university_id: localStorage.getItem('universityId') // Set university_id from local storage
    });
    setShowForm(true);
  };

  const openEditForm = (notice) => {
    setEditNotice(notice);
    setShowEditForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewNotice(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditNotice(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/getNotices/addNotices', newNotice);
      setShowForm(false); // Hide the form after submission
      // Fetch updated notices
      const universityId = localStorage.getItem('universityId');
      const response = await axios.get(`http://localhost:4000/api/getNotices/notices/${universityId}`);
      setNotices(response.data);
    } catch (error) {
      console.error('Error adding notice:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/getNotices/editNotices/${editNotice.notice_id}`, editNotice);
      setShowEditForm(false); // Hide the form after submission
      setEditNotice(null); // Reset edit notice state
      // Fetch updated notices
      const universityId = localStorage.getItem('universityId');
      const response = await axios.get(`http://localhost:4000/api/getNotices/notices/${universityId}`);
      setNotices(response.data);
    } catch (error) {
      console.error('Error updating notice:', error);
    }
  };

  const handleDelete = async (noticeId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/getNotices/deleteNotices/${noticeId}`);
      if (response.status === 204) {
        // Fetch updated notices
        const universityId = localStorage.getItem('universityId');
        const updatedResponse = await axios.get(`http://localhost:4000/api/getNotices/notices/${universityId}`);
        setNotices(updatedResponse.data);
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Dashnav universityName={universityName} universityInitials={universityInitials} />
      <div className="flex flex-grow">
        <AdminSideNav />
        <main className="flex-1 p-4">
          <div className="flex justify-center text-center mt-28 ml-80">
            <h1 className="text-xl uppercase bg-green-500 p-2 text-white font-bold">
              Publish Notices
            </h1>
          </div>
  
          <div className="flex justify-end mt-6 mr-10">
            <button 
              onClick={openAddForm}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Notice
            </button>
          </div>
  
          {/* Modal for adding a notice */}
          <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Add New Notice</h2>
              <div>
                <label className="block text-sm font-bold mb-2" htmlFor="notice_title">
                  Title
                </label>
                <input
                  type="text"
                  id="notice_title"
                  name="notice_title"
                  value={newNotice.notice_title}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" htmlFor="notice_body">
                  Body
                </label>
                <textarea
                  id="notice_body"
                  name="notice_body"
                  value={newNotice.notice_body}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  rows="5"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </Modal>
  
          {/* Modal for editing a notice */}
          {editNotice && (
            <Modal isOpen={showEditForm} onClose={() => setShowEditForm(false)}>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Edit Notice</h2>
                <div>
                  <label className="block text-sm font-bold mb-2" htmlFor="notice_title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="notice_title"
                    name="notice_title"
                    value={editNotice.notice_title}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" htmlFor="notice_body">
                    Body
                  </label>
                  <textarea
                    id="notice_body"
                    name="notice_body"
                    value={editNotice.notice_body}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    rows="5"
                    required
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    Update
                  </button>
                </div>
              </form>
            </Modal>
          )}
  
          {/* Notices */}
          {notices.length === 0 ? (
            <p className="ml-80 mr-20 mt-10 bg-slate-200 rounded p-2">No Notices Found!</p>
          ) : (
            notices.map(notice => (
              <div key={notice.notice_id} className="ml-80 mr-20 mt-10 bg-slate-200 rounded p-2">
                <div className="flex justify-between items-center font-bold">
                  <h1>Notice id: {notice.notice_id}</h1>
                  <h1 className="text-xl uppercase">{notice.notice_title}</h1>
                  <div>
                    <button
                      onClick={() => openEditForm(notice)}
                      className="bg-yellow-500 text-white p-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(notice.notice_id)}
                      className="bg-red-500 text-white p-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-5 text-sm">
                  {notice.notice_body}
                </p>
                <p className="mt-2 font-bold">University Name: {notice.university_name}</p>
                <p className="text-sm">Date: {notice.date_published}</p>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
   
  );
};
  export default PublishNotice;

 