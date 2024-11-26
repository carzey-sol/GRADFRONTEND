"use client"
import React, { useState, useEffect } from "react";
import Dashnav from "../../components/dashnav";
import AdminSideNav from "../page";
import PopupForm from "../../components/mgteachpopupForm"; // Adjust the import path as needed

const ManageTeachers = ({ universityName, universityInitials }) => {
  // State variables initialization
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [teacherName, setTeacherName] = useState(""); // State for teacher name input
  const [teacherEmail, setTeacherEmail] = useState(""); // State for teacher email input
  const [teacherPassword, setTeacherPassword] = useState(""); // State for teacher password input
  const [selectedCourse, setSelectedCourse] = useState(""); // State for selected course

  let universityId = "";

  // Check if localStorage is available
  if (typeof window !== "undefined") {
    universityId = localStorage.getItem("universityId");
  }

  // Fetch teachers and courses on component mount
  useEffect(() => {
    fetchTeachers();
    fetchCourses();
  }, []);

  // Function to fetch teachers from API
  const fetchTeachers = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/manageTeachers/teachers/${universityId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTeachers(data); // Update teachers state with fetched data
    } catch (error) {
      console.error("Error fetching teachers:", error);
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

  // Function to handle adding a new teacher
  const handleAddTeacher = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/manageTeachers/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: teacherName,
            email: teacherEmail,
            password: teacherPassword,
            university_id: universityId,
            course_id: selectedCourse, // Include the selected course ID
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchTeachers(); // Refresh teachers list
      setShowPopup(false); // Close popup after successful submission
      setTeacherName(""); // Clear teacher name input after submission
      setTeacherEmail(""); // Clear teacher email input after submission
      setTeacherPassword(""); // Clear teacher password input after submission
      setSelectedCourse(""); // Clear selected course after submission
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
  };

  // Function to handle updating an existing teacher
  const handleUpdateTeacher = async (teacherId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/manageTeachers/update/${teacherId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: teacherName,
            email: teacherEmail,
            password: teacherPassword,
            university_id: universityId, // Include university_id in the request body
            course_id: selectedCourse, // Update course_id in the request body
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchTeachers(); // Refresh teachers list after successful update
      setShowPopup(false); // Close popup after successful update
      setTeacherName(""); // Clear teacher name input
      setTeacherEmail(""); // Clear teacher email input
      setTeacherPassword(""); // Clear teacher password input
      setSelectedCourse(""); // Clear selected course
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  // Function to handle deleting a teacher
  const handleDeleteTeacher = async (teacherId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/manageTeachers/delete/${teacherId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchTeachers(); // Refresh teachers list after successful deletion
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  // Function to toggle popup form for adding/editing teachers
  const togglePopup = (title, teacher = null) => {
    setPopupTitle(title); // Set the title of the popup form
    setCurrentTeacher(teacher); // Set the current teacher being edited
    setShowPopup(true); // Display the popup form

    // If editing a teacher, populate the teacher name and selected course
    if (title === "Edit Teacher" && teacher) {
      setTeacherName(teacher.name); // Populate teacher name input
      setTeacherEmail(teacher.email); // Populate teacher email input
      setTeacherPassword(""); // Ensure password field is empty for security
      setSelectedCourse(teacher.course_id); // Populate selected course
    } else {
      // Clear fields when adding a new teacher
      setTeacherName(""); // Clear teacher name input
      setTeacherEmail(""); // Clear teacher email input
      setTeacherPassword(""); // Clear teacher password input
      setSelectedCourse(""); // Clear selected course
    }
  };

  // JSX for the form content based on the popupTitle state
  let formContent = null;
  switch (popupTitle) {
    case "Add Teacher":
      formContent = (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTeacher();
          }}
        >
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="teacherName"
            >
              Teacher Name:
            </label>
            <input
              type="text"
              id="teacherName"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="teacherEmail"
            >
              Email:
            </label>
            <input
              type="email"
              id="teacherEmail"
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="teacherPassword"
            >
              Password:
            </label>
            <input
              type="password"
              id="teacherPassword"
              value={teacherPassword}
              onChange={(e) => setTeacherPassword(e.target.value)}
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
            Add Teacher
          </button>
        </form>
      );
      break;
    case "Edit Teacher":
      formContent = (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateTeacher(currentTeacher.id);
          }}
        >
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="teacherName"
            >
              Teacher Name:
            </label>
            <input
              type="text"
              id="teacherName"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="teacherEmail"
            >
              Email:
            </label>
            <input
              type="email"
              id="teacherEmail"
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="teacherPassword"
            >
              Password:
            </label>
            <input
              type="password"
              id="teacherPassword"
              value={teacherPassword}
              onChange={(e) => setTeacherPassword(e.target.value)}
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
            Update Teacher
          </button>
        </form>
      );
      break;

    default:
      formContent = null;
  }

  // JSX for the ManageTeachers component
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
          Manage Teachers
        </h1>
      </div>
      <div className="ml-80 mt-2 mr-5">
        <div className="flex justify-end">
          <button
            className="bg-green-500 p-2 text-xs text-white"
            onClick={() => togglePopup("Add Teacher")}
          >
            Add Teacher
          </button>
        </div>
        <div className="">
          <div className="mt-5">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex justify-between p-2 bg-slate-200 rounded mt-5"
              >
                <div className="flex flex-col gap-2">
                  <div>Teacher ID: {teacher.id}</div>
                  <div className="font-bold text-3xl">
                    Teacher Name: {teacher.name}
                  </div>
                  <div>Course ID: {teacher.course_id}</div>
                  <div>Course Name: {teacher.course_name}</div>
                </div>
                <div className="grid grid-cols-2 gap-5 text-xs">
                  <button
                    className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    onClick={() => togglePopup("Edit Teacher", teacher)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDeleteTeacher(teacher.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* PopupForm component for adding/editing teachers */}
      <PopupForm
        handleClose={() => setShowPopup(false)}
        show={showPopup}
        title={popupTitle}
        formContent={formContent} // Pass form content as prop
        teacherName={teacherName} // Pass teacherName state
        setTeacherName={setTeacherName} // Pass setTeacherName function
        handleFormSubmit={
          popupTitle === "Edit Teacher"
            ? () => handleUpdateTeacher(currentTeacher.id)
            : handleAddTeacher
        } // Pass appropriate submit handler based on popupTitle
      />
    </div>
  );
};

export default ManageTeachers;
