"use client"
import React, { useState, useEffect } from "react";
import Dashnav from "../../components/dashnav";
import AdminSideNav from "../page";
import MgsubPopupForm from "../../components/mgsubpopupForm"; // Adjust the import path as needed

const ManageSubjects = ({ universityName, universityInitials }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [currentSubject, setCurrentSubject] = useState(null);
  const [subjectName, setSubjectName] = useState(""); // State for subject name input

  let universityId = "";

  // Check if localStorage is available
  if (typeof window !== "undefined") {
    universityId = localStorage.getItem("universityId");
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetching courses
  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/manageCourses/courses/${universityId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data); // Assuming your API returns an array of courses
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Fetching subjects using selected course ID
  const fetchSubjects = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/manageSubjects/subjects/${courseId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSubjects(data); // Assuming your API returns an array of subjects
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  // Handle course selection change
  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourseId(courseId);
    fetchSubjects(courseId);
  };

  // Handle add subject
  const handleAddSubject = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/manageSubjects/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: subjectName,
            course_id: selectedCourseId,
            university_id: universityId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchSubjects(selectedCourseId); // Refresh subjects list
      setShowPopup(false); // Close popup after successful submission
      setSubjectName(""); // Clear subject name input after submission
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  // Handle update subject
  const handleUpdateSubject = async (subjectId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/manageSubjects/update/${subjectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: subjectName,
            course_id: selectedCourseId,
            university_id: universityId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchSubjects(selectedCourseId); // Refresh subjects list
      setShowPopup(false); // Close popup after successful update
      setSubjectName(""); // Clear subject name input after submission
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  // Toggle popup and set title
  const togglePopup = (title, subject = null) => {
    setPopupTitle(title); // Set the popupTitle state based on action
    setCurrentSubject(subject); // Set the current subject being edited or null
    setShowPopup(true);
    if (title === "Edit Subject" && subject) {
      setSubjectName(subject.name); // Populate subjectName with current subject name
      setSelectedCourseId(subject.course_id); // Set selected course ID
    }
  };

  // Function to handle deleting a subject
  const handleDeleteCourse = async (subjectId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/manageSubjects/delete/${subjectId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchSubjects(selectedCourseId); // Refresh subjects list
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  // Form content based on popupTitle
  let formContent = null;
  switch (popupTitle) {
    case "Add Subject":
      formContent = (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddSubject();
          }}
        >
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="subjectName"
            >
              Subject Name:
            </label>
            <input
              type="text"
              id="subjectName"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <p className="block text-sm font-bold mb-2">Select Course:</p>
            {courses.map((course) => (
              <div key={course.id} className="mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="course"
                    value={course.id}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="form-radio"
                    required
                  />
                  <span className="ml-2">{course.name}</span>
                </label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Subject
          </button>
        </form>
      );
      break;
    case "Edit Subject":
      formContent = (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateSubject(currentSubject.id);
          }}
        >
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="subjectName"
            >
              Subject Name:
            </label>
            <input
              type="text"
              id="subjectName"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <p className="block text-sm font-bold mb-2">Select Course:</p>
            {courses.map((course) => (
              <div key={course.id} className="mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="course"
                    value={course.id}
                    checked={selectedCourseId === course.id}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="form-radio"
                    required
                  />
                  <span className="ml-2">{course.name}</span>
                </label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Update Subject
          </button>
        </form>
      );
      break;
    case "Assign Teachers":
      formContent = <div>/* Your form for assigning teachers */</div>;
      break;
    case "Assign Students":
      formContent = <div>/* Your form for assigning students */</div>;
      break;
    default:
      formContent = null;
  }


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
          Manage subjects
        </h1>
      </div>
      <div className="ml-80 mt-2 mr-5">
        <div className="flex justify-between">
          <div className="mt-2">
            <label htmlFor="courseSelect" className="mr-2">
              Select Course:
            </label>
            <select
              id="courseSelect"
              value={selectedCourseId}
              onChange={handleCourseChange}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="">-- Select Course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.id} - {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="justify-end">
            <button
              className="bg-green-500 p-2 text-xs text-white"
              onClick={() => togglePopup("Add Subject")}
            >
              Add Subject
            </button>
          </div>
        </div>
        <div className="">
          <div className="mt-2">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="flex justify-between p-2 bg-slate-200 rounded mt-5"
              >
                <div className=" flex flex-col gap-2">
                  <div>Subject ID: {subject.id}</div>
                  <div className="font-bold text-3xl">
                    Subject Name: {subject.name}
                  </div>
                  <div>Course ID: {subject.course_id}</div>
                </div>

                <div className="grid grid-cols-2 gap-5 text-xs">
                  <button
                    className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    onClick={() => togglePopup("Edit Subject", subject)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDeleteCourse(subject.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
                    onClick={() => togglePopup("Assign Teachers")}
                  >
                    Assign Teachers
                  </button>
                  <button
                    className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => togglePopup("Assign Students")}
                  >
                    Assign Students
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <MgsubPopupForm
        handleClose={() => setShowPopup(false)}
        show={showPopup}
        title={popupTitle}
        formContent={formContent} // Pass form content as prop
        subjectName={subjectName} // Pass subjectName state
        setSubjectName={setSubjectName} // Pass setSubjectName function
        handleFormSubmit={handleAddSubject} // Pass handleAddSubject function
      />
    </div>
  );
};

export default ManageSubjects;
