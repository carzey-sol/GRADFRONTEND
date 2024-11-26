import React, { useState } from 'react';

const ComplaintModal = ({ complaint, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState(complaint.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateStatus(complaint.id, status);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Update Complaint Status</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="pending">Complaints</option>
              <option value="under review">Reviewed</option>
              <option value="resolved">Solved</option>
            </select>
          </label>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintModal;
