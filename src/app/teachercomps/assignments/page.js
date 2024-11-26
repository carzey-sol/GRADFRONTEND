"use client";
import React, { useEffect, useState } from 'react';
import Dashnav from "@/app/components/dashnav";
import TeacherNav from "../teacherNav";
import Loading from "../../components/loading";

const GradePopup = ({ assignmentId, onClose }) => {
  const [submissions, setSubmissions] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [grades, setGrades] = useState({});

  useEffect(() => {
    fetchSubmissions(assignmentId);
  }, [assignmentId]);

  const fetchSubmissions = async (assignmentId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/assignmentsTeacher/submissions?assignmentId=${assignmentId}`);
      if (!response.ok) throw new Error('Submissions not found');
      const data = await response.json();
      setSubmissions(data.submissions || []);
      // Set initial feedback and grades if present
      const initialFeedbacks = {};
      const initialGrades = {};
      data.submissions.forEach(submission => {
        initialFeedbacks[submission.id] = submission.feedback || '';
        initialGrades[submission.id] = submission.grade || '';
      });
      setFeedbacks(initialFeedbacks);
      setGrades(initialGrades);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleGradeSubmission = async (submissionId, grade, feedback) => {
    try {
      const response = await fetch(`http://localhost:4000/api/assignmentsTeacher/grade-submission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionId, grade, feedback }),
      });
  
      if (response.ok) {
        fetchSubmissions(assignmentId); // Refresh the submissions after grading
      } else {
        const errorText = await response.text();
        console.error('Failed to grade submission:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error grading submission:', error);
    }
  };
  

  const handleFeedbackChange = (submissionId, feedback) => {
    setFeedbacks({
      ...feedbacks,
      [submissionId]: feedback,
    });
  };

  const handleGradeChange = (submissionId, grade) => {
    setGrades({
      ...grades,
      [submissionId]: grade,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded shadow-lg w-full h-full overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Grade Submissions</h2>
        {submissions.length > 0 ? (
          submissions.map((submission) => (
            <div key={submission.id} className="mb-4 p-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Submission ID:</strong> {submission.id}</p>
                  <p><strong>File Name:</strong> {submission.file_name}</p>
                  <a href={submission.file_path} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    Download Submission
                  </a>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleGradeSubmission(
                      submission.id,
                      grades[submission.id] || '',
                      feedbacks[submission.id] || ''
                    );
                  }}
                  className="flex flex-col items-end"
                >
                  <input
                    type="number"
                    placeholder="Grade"
                    value={grades[submission.id] || ''}
                    onChange={(e) => handleGradeChange(submission.id, e.target.value)}
                    className="border border-gray-300 rounded mt-2 p-2 w-32"
                  />
                  <textarea
                    placeholder="Feedback"
                    value={feedbacks[submission.id] || ''}
                    onChange={(e) => handleFeedbackChange(submission.id, e.target.value)}
                    className="border border-gray-300 rounded mt-2 p-2 w-64"
                    rows="3"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
                  >
                    Done
                  </button>
                </form>
              </div>
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

const Subjects = ({ universityName, universityInitials }) => {
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [showAddAssignmentPopup, setShowAddAssignmentPopup] = useState(false);
  const [showGradePopup, setShowGradePopup] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  useEffect(() => {
    const simulateLoading = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(simulateLoading);
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    const email = localStorage.getItem('email');
    const universityId = localStorage.getItem('universityId');
    if (email && universityId) {
      fetchCoursesAndSubjects(email);
    }
  }, []);

  useEffect(() => {
    const email = localStorage.getItem('email');
    const universityId = localStorage.getItem('universityId');
    if (email && universityId && selectedCourseId) {
      fetchAssignments(email, universityId, selectedCourseId);
    }
  }, [selectedCourseId]);

  const fetchCoursesAndSubjects = async (email) => {
    try {
      const response = await fetch(`http://localhost:4000/api/assignmentsTeacher/user-data?email=${email}`);
      const data = await response.json();
      setCourses(data.courses);
      setSubjects(data.subjects);
      if (data.courses.length > 0) {
        setSelectedCourseId(data.courses[0].id);
      }
    } catch (error) {
      console.error('Error fetching courses and subjects:', error);
    }
  };

  const fetchAssignments = async (email, universityId, courseId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/assignmentsTeacher/assignments?universityId=${universityId}&courseId=${courseId}`);
      const data = await response.json();
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleAddAssignment = () => {
    setShowAddAssignmentPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddAssignmentPopup(false);
  };

  const handleSaveAssignment = async (formData) => {
    const universityId = localStorage.getItem('universityId');

    if (!universityId) {
      console.error('University ID is not available');
      return;
    }

    formData.append('universityId', universityId);

    try {
      const response = await fetch('http://localhost:4000/api/assignmentsTeacher/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const savedAssignment = await response.json();
        setAssignments([...assignments, savedAssignment.data]);
        setShowAddAssignmentPopup(false);
      } else {
        console.error('Failed to save assignment:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving assignment:', error);
    }
  };

  const handleGradeSubmissions = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setShowGradePopup(true);
  };

  return (
    <div>
      <div className="flex">
        <Dashnav
          universityName={universityName}
          universityInitials={universityInitials}
        />
        <TeacherNav />
      </div>

      <div>
        {showLoading ? (
          <Loading />
        ) : (
          <div className="p-8">
            <div className="flex ml-80 mt-32 justify-center">
              <h1 className="text-xl uppercase font-bold bg-green-500 p-2 text-white">
                Post Assignments
              </h1>
            </div>
            <div className="flex justify-center mt-10">
              <button
                onClick={handleAddAssignment}
                className="bg-blue-500 text-white py-2 px-4 rounded fixed mt-96 ml-72"
              >
                Add Assignment
              </button>
            </div>

            {/* Assignments List */}
            <div className="mt-2 ml-80 border-black solid">
              {assignments.length > 0 ? (
                assignments.map((assignment, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 border-b"
                  >
                    <div>
                      <h2 className="font-bold">Assignment Title: {assignment.title}</h2>
                      <p>Description: {assignment.description}</p>
                      <p>Subject: {assignment.subject_name}</p>
                      <p><strong>Due Date:</strong> {assignment.due_date}</p>
                    </div>
                    <div className="flex gap-4">
                      <a href={assignment.file_path} target="_blank" download>
                        <button className="bg-green-500 text-white py-2 px-4 rounded">
                          Download Brief
                        </button>
                      </a>
                      <button
                        className="bg-yellow-500 text-white py-2 px-4 rounded"
                        onClick={() => handleGradeSubmissions(assignment.id)}
                      >
                        Grade Submissions
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No assignments available.</p>
              )}
            </div>

            {showAddAssignmentPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-8 rounded shadow-lg w-1/2">
                  <h2 className="text-lg font-bold mb-4">Add Assignment</h2>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      await handleSaveAssignment(formData);
                    }}
                  >
                    <div className="mb-4">
                      <label className="block font-bold">Title:</label>
                      <input
                        type="text"
                        name="title"
                        className="w-full border border-gray-300 rounded p-2"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-bold">Description:</label>
                      <textarea
                        name="description"
                        className="w-full border border-gray-300 rounded p-2"
                        required
                      ></textarea>
                    </div>
                    <div className="mb-4">
                      <label className="block font-bold">Subject:</label>
                      <select
                        name="subjectId"
                        className="w-full border border-gray-300 rounded p-2"
                        required
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block font-bold">Due Date:</label>
                      <input
                        type="date"
                        name="dueDate"
                        className="w-full border border-gray-300 rounded p-2"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-bold">Upload Brief:</label>
                      <input
                        type="file"
                        name="file"
                        className="w-full border border-gray-300 rounded p-2"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                      >
                        Save Assignment
                      </button>
                      <button
                        type="button"
                        onClick={handleClosePopup}
                        className="bg-red-500 text-white py-2 px-4 rounded ml-4"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showGradePopup && (
              <GradePopup
                assignmentId={selectedAssignmentId}
                onClose={() => setShowGradePopup(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
