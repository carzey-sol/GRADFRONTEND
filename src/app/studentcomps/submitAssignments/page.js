"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashnav from "../../components/dashnav";
import StudentNav from "../studentnav";
import Loading from "../../components/loading";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [gradeFeedback, setGradeFeedback] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          console.error('Email not found in localStorage');
          return;
        }

        const response = await axios.get(`http://localhost:4000/api/studentassignments/assignments?email=${email}`);
        setAssignments(response.data.assignments || []);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitAssignment = async (assignmentId) => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentId', assignmentId);
    const email = localStorage.getItem('email');
    formData.append('email', email);

    try {
      const response = await axios.post('http://localhost:4000/api/studentassignments/submit-assignment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(response.data.message);
      setFile(null); // Clear the file input after submission
      setSelectedAssignment(null); // Reset selected assignment
      setIsSubmitModalOpen(false); // Close the modal
    } catch (error) {
      console.error('Error submitting assignment:', error);
    }
  };

  const handleViewGrade = async (assignmentId) => {
    try {
      const email = localStorage.getItem('email');
      const response = await axios.get(`http://localhost:4000/api/studentassignments/view-grade?assignmentId=${assignmentId}&email=${email}`);
      
      console.log('Grade response:', response.data); // Debugging the response
      setGradeFeedback(response.data);
      
      if (response.data && response.data.grade) {
        setIsGradeModalOpen(true); // Only open the modal if data is present
      } else {
        alert('No grade data found for this assignment.');
      }
    } catch (error) {
      console.error('Error fetching grade:', error);
    }
  };

  const openSubmitModal = (assignmentId) => {
    setSelectedAssignment(assignmentId);
    setIsSubmitModalOpen(true);
  };

  const closeSubmitModal = () => {
    setIsSubmitModalOpen(false);
  };

  const closeGradeModal = () => {
    setGradeFeedback(null);
    setIsGradeModalOpen(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Dashnav />
      <div className="overflow-hidden">
        <StudentNav />
        <div className="flex flex-col items-center overflow-auto mt-32">
          <h1 className="text-xl font-bold mb-4 pt-3">
            <span className="bg-green-500 text-white p-2">Submit Assignments</span>
          </h1>

          {assignments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 ml-80 mt-5">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-300 p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-2">Assignment Title: {assignment.title}</h2>
                  <p className="mb-2 text-sm"><strong>Description:</strong> {assignment.description}</p>
                  <p className="mb-2 text-sm"><strong>Subject:</strong> {assignment.subject_name}</p>
                  <p className="mb-4 text-sm"><strong>Due Date:</strong> {assignment.due_date}</p>
                  <div className="flex gap-4">
                    <a 
                      href={assignment.file_path} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                    >
                      Download Brief
                    </a>
                    <button 
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                      onClick={() => openSubmitModal(assignment.id)}
                    >
                      {assignment.submitted ? 'Resubmit Assignment' : 'Submit Assignment'}
                    </button>
                    <button 
                      className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
                      onClick={() => handleViewGrade(assignment.id)}
                    >
                      View Grade
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No assignments found.</p>
          )}

          {isSubmitModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Submit Assignment</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmitAssignment(selectedAssignment); }}>
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    required 
                    className="mb-4 w-full"
                  />
                  <button 
                    type="submit" 
                    className="bg-green-500 text-white py-2 px-4 rounded w-full"
                  >
                    Submit Assignment
                  </button>
                  <button 
                    type="button" 
                    onClick={closeSubmitModal} 
                    className="mt-4 bg-gray-500 text-white py-2 px-4 rounded w-full"
                  >
                    Close
                  </button>
                </form>
              </div>
            </div>
          )}

          {isGradeModalOpen && gradeFeedback && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Grade and Feedback</h2>
                <p className="mb-2 text-sm"><strong>Grade:</strong> {gradeFeedback.grade || 'N/A'}</p>
                <p className="text-sm"><strong>Feedback:</strong> {gradeFeedback.feedback || 'N/A'}</p>
                <button 
                  type="button" 
                  onClick={closeGradeModal} 
                  className="mt-4 bg-gray-500 text-white py-2 px-4 rounded w-full"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
