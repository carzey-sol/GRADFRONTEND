"use client";
import React, { useState, useEffect } from 'react';
import Dashnav from '../../components/dashnav';
import AdminSideNav from '../page';
import ComplaintModal from '../../components/ComplaintModal';
import ComplaintDetailModal from '../../components/complaintDetailedModal'; // Import a new component

const ReviewComplaints = ({ universityName, universityInitials }) => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false); // New state for detail modal
  const [universityId, setUniversityId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('universityId');
    setUniversityId(id);

    if (id) {
      fetch(`http://localhost:4000/api/reviewcomplaints/fetchStatus/${id}`)
        .then((response) => response.json())
        .then((data) => setComplaints(data))
        .catch((error) => console.error('Error fetching complaints:', error));
    }
  }, []);

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedComplaint(null);
    setModalOpen(false);
  };

  const openDetailModal = (complaint) => {
    setSelectedComplaint(complaint);
    setDetailModalOpen(true); // Open detail modal
  };

  const closeDetailModal = () => {
    setSelectedComplaint(null);
    setDetailModalOpen(false); // Close detail modal
  };

  const updateComplaintStatus = (id, status) => {
    fetch(`http://localhost:4000/api/reviewcomplaints/updateStatus/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
      .then((response) => response.json())
      .then((updatedComplaint) => {
        if (updatedComplaint.message === 'Invalid status') {
          console.error('Invalid status value provided.');
        } else if (updatedComplaint.message === 'Complaint not found') {
          console.error('Complaint ID does not exist.');
        } else {
          setComplaints((prevComplaints) =>
            prevComplaints.map((complaint) =>
              complaint.id === updatedComplaint.id ? updatedComplaint : complaint
            )
          );
          closeModal();
        }
      })
      .catch((error) => console.error('Error updating complaint status:', error));
  };

  return (
    <div className="flex">
      <Dashnav universityName={universityName} universityInitials={universityInitials} />
      <AdminSideNav />
      <div className="flex-1 p-6 ml-80 mt-28">
        <div className=' flex justify-center text-center text-white'>
        <h1 className="text-xl font-bold mb-4 uppercase bg-green-500 p-2">Review Complaints</h1>
        </div>
        <ul className="space-y-4">
          {complaints.map((complaint) => (
            <li key={complaint.id} className="p-4 border rounded shadow">
              <div className="flex justify-between items-center">
                <span>{complaint.title} - {complaint.status}</span>
                <div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => openDetailModal(complaint)} // Open detail modal
                  >
                    View Details
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => openModal(complaint)}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {modalOpen && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={closeModal}
          onUpdateStatus={updateComplaintStatus}
        />
      )}
      {detailModalOpen && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={closeDetailModal} // Close detail modal
        />
      )}
    </div>
  );
};

export default ReviewComplaints;
