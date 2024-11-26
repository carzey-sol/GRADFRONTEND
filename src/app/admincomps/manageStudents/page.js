"use client"
import React, { useState, useEffect } from "react";
import Dashnav from "../../components/dashnav";
import AdminSideNav from "../page";
import PopupForm from "../../components/mgstudentpopupForm"; // Adjust the import path as needed

const ManageStudents = ({ universityName, universityInitials }) => {
  // State variables initialization
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [currentStudent, setCurrentStudent] = useState(null);
  const [studentName, setStudentName] = useState(""); // State for student name input
  const [studentEmail, setStudentEmail] = useState(""); // State for student email input
  const [studentPassword, setStudentPassword] = useState(""); // State for student password input
  const [selectedCourse, setSelectedCourse] = useState(""); // State for selected course

  let universityId = "";

  // Check if localStorage is available
  if (typeof window !== "undefined") {
    universityId = localStorage.getItem("universityId");
  }

  // Fetch students and courses on component mount
  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, [fetchCourses, fetchStudents]);

  // Function to fetch students from API
  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/manageStudents/students/${universityId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data); // Update students state with fetched data
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Function to fetch courses from API
  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/manageCourses/courses/${universityId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data); // Update courses state with fetched data
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Function to handle adding a new student
  const handleAddStudent = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/manageStudents/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: studentName,
            email: studentEmail,
            password: studentPassword,
            university_id: universityId,
            course_id: selectedCourse, // Include the selected course ID
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchStudents(); // Refresh students list
      setShowPopup(false); // Close popup after successful submission
      setStudentName(""); // Clear student name input after submission
      setStudentEmail(""); // Clear student email input after submission
      setStudentPassword(""); // Clear student password input after submission
      setSelectedCourse(""); // Clear selected course after submission
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  // Function to handle updating an existing student
  const handleUpdateStudent = async (studentId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/manageStudents/update/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: studentName,
            email: studentEmail,
            password: studentPassword,
            university_id: universityId, // Include university_id in the request body
            course_id: selectedCourse, // Update course_id in the request body
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchStudents(); // Refresh students list after successful update
      setShowPopup(false); // Close popup after successful update
      setStudentName(""); // Clear student name input
      setStudentEmail(""); // Clear student email input
      setStudentPassword(""); // Clear student password input
      setSelectedCourse(""); // Clear selected course
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  // Function to handle deleting a student
  const handleDeleteStudent = async (studentId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/manageStudents/delete/${studentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchStudents(); // Refresh students list after successful deletion
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // Function to toggle popup form for adding/editing students
  const togglePopup = (title, student = null) => {
    setPopupTitle(title); // Set the title of the popup form
    setCurrentStudent(student); // Set the current student being edited
    setShowPopup(true); // Display the popup form

    // If editing a student, populate the student name and selected course
    if (title === "Edit Student" && student) {
      setStudentName(student.name); // Populate student name input
      setStudentEmail(student.email); // Populate student email input
      setStudentPassword(""); // Ensure password field is empty for security
      setSelectedCourse(student.course_id); // Populate selected course
    } else {
      // Clear fields when adding a new student
      setStudentName(""); // Clear student name input
      setStudentEmail(""); // Clear student email input
      setStudentPassword(""); // Clear student password input
      setSelectedCourse(""); // Clear selected course
    }
  };

  // JSX for the form content based on the popupTitle state
  let formContent = null;
  switch (popupTitle) {
    case "Add Student":
      formContent = (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddStudent();
          }}
        >
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="studentName"
            >
              Student Name:
            </label>
            <input
              type="text"
              id="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="studentEmail"
            >
              Email:
            </label>
            <input
              type="email"
              id="studentEmail"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="studentPassword"
            >
              Password:
            </label>
            <input
              type="password"
              id="studentPassword"
              value={studentPassword}
              onChange={(e) => setStudentPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="selectedCourse"
            >
              Select Course:
            </label>
            <select
              id="selectedCourse"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="" disabled>Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Student
          </button>
        </form>
      );
      break;
    case "Edit Student":
      formContent = (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateStudent(currentStudent.id);
          }}
        >
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="studentName"
            >
              Student Name:
            </label>
            <input
              type="text"
              id="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="studentEmail"
            >
              Email:
            </label>
            <input
              type="email"
              id="studentEmail"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="studentPassword"
            >
              Password:
            </label>
            <input
              type="password"
              id="studentPassword"
              value={studentPassword}
              onChange={(e) => setStudentPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="selectedCourse"
            >
              Select Course:
            </label>
            <select
              id="selectedCourse"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="" disabled>Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Student
          </button>
        </form>
      );
      break;

    default:
      formContent = null;
  }

  // JSX for the ManageStudents component
  return (
    <div>
      <div className="flex">
        <Dashnav
          universityName={universityName}
          universityInitials={universityInitials}
        />
        <AdminSideNav />
      </div>
      <div className="flex justify-center text-center ml-80 mt-28">
        <h1 className="text-xl uppercase bg-green-500 p-2 text-white font-bold">
          Manage Students
        </h1>
      </div>
      <div className="ml-80 mt-2 mr-5">
        <div className="flex justify-end">
          <button
            className="bg-green-500 p-2 text-xs text-white"
            onClick={() => togglePopup("Add Student")}
          >
            Add Student
          </button>
        </div>
        <div className="">
          <div className="mt-5">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex justify-between p-2 bg-slate-200 rounded mt-5"
              >
                <div className="flex flex-col gap-2">
                  <div>Student ID: {student.id}</div>
                  <div className="font-bold text-3xl">
                    Student Name: {student.name}
                  </div>
                  <div>Course ID: {student.course_id}</div>
                  <div>Course Name: {student.course_name}</div>
                </div>
                <div className="grid grid-cols-2 gap-5 text-xs">
                  <button
                    className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    onClick={() => togglePopup("Edit Student", student)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* PopupForm component for adding/editing students */}
      <PopupForm
        handleClose={() => setShowPopup(false)}
        show={showPopup}
        title={popupTitle}
        formContent={formContent} // Pass form content as prop
        studentName={studentName} // Pass studentName state
        setStudentName={setStudentName} // Pass setStudentName function
        handleFormSubmit={
          popupTitle === "Edit Student"
            ? () => handleUpdateStudent(currentStudent.id)
            : handleAddStudent
        } // Pass appropriate submit handler based on popupTitle
      />
    </div>
  );
};

export default ManageStudents;
