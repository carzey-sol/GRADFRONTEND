
import React, { useEffect, useState } from 'react';

const GradePopup = ({ assignmentId, onClose }) => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchSubmissions(assignmentId);
  }, [assignmentId]);

  const fetchSubmissions = async (assignmentId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/submissions?assignmentId=${assignmentId}`);
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleGradeSubmission = async (submissionId, grade) => {
    try {
      const response = await fetch(`http://localhost:4000/api/gradeSubmission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionId, grade }),
      });

      if (response.ok) {
        fetchSubmissions(assignmentId); // Refresh the submissions after grading
      } else {
        console.error('Failed to grade submission:', response.statusText);
      }
    } catch (error) {
      console.error('Error grading submission:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4">Grade Submissions</h2>
        {submissions.length > 0 ? (
          submissions.map((submission) => (
            <div key={submission.id} className="mb-4">
              <p>Submission ID: {submission.id}</p>
              <p>File Name: {submission.file_name}</p>
              <a href={submission.file_path} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Download Submission
              </a>
              <input
                type="number"
                placeholder="Grade"
                onChange={(e) => handleGradeSubmission(submission.id, e.target.value)}
                className="border border-gray-300 rounded mt-2 p-2"
              />
            </div>
          ))
        ) : (
          <p>No submissions available.</p>
        )}
        <button onClick={onClose} className="bg-red-500 text-white py-2 px-4 rounded mt-4">
          Close
        </button>
      </div>
    </div>
  );
};

export default GradePopup;
