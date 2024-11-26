import React from 'react';

const ComplaintDetailModal = ({ complaint, onClose }) => {
  if (!complaint) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">{complaint.title}</h2>
        <p className="mb-4">{complaint.description}</p>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailModal;
