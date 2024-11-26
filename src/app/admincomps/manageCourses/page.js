"use client";
import React, { useState, useEffect, useRef } from "react";
import Dashnav from "../../components/dashnav";
import AdminSideNav from "../page";
import PopupForm from "../../components/mgcpopupForm"; // Ensure the path is correct
import Loading from "../../components/loading";

const ManageCourses = ({ universityName, universityInitials }) => {
  const [courses, setCourses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [intake, setIntake] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(true);

  let universityId = "";
  if (typeof window !== "undefined") {
    universityId = localStorage.getItem("universityId");
  }
  const timerRef = useRef(null);

  const fetchCourses = async () => {
    setLoading(true);
    if (timerRef.current) clearTimeout(timerRef.current); // Clear previous timer
    timerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/manageCourses/courses/${universityId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Courses data:", data);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    }, 1000); // 1 second delay
  };

  useEffect(() => {
    if (universityId) {
        fetchCourses();
     
    }
  }, [universityId]);

  const togglePopup = (title, course = null) => {
    setPopupTitle(title);
    setSelectedCourse(course);
    if (course) {
      setCourseName(course.name);
      setIntake(course.intake);
      setSemester(course.semester);
    } else {
      setCourseName("");
      setIntake("");
      setSemester("");
    }
    setShowPopup(!showPopup);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseData = {
      name: courseName,
      intake,
      semester,
      universityId,
    };

    try {
      const response = await fetch(
        `http://localhost:4000/api/manageCourses/addCourse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newCourse = await response.json();
      setCourses([...courses, newCourse]);
      setShowPopup(false); // Close the popup after successful submission
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const courseData = {
      name: courseName,
      intake,
      semester,
      universityId,
    };

    try {
      const response = await fetch(
        `http://localhost:4000/api/manageCourses/editCourse/${selectedCourse.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedCourse = await response.json();
      setCourses(
        courses.map((course) =>
          course.id === updatedCourse.id ? updatedCourse : course
        )
      );
      setShowPopup(false); // Close the popup after successful submission
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/manageCourses/deleteCourse/${courseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ universityId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the deleted course from state
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const renderAddCourseForm = () => (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Course Name:
        </label>
        <input
          type="text"
          name="courseName"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Intake:
        </label>
        <input
          type="text"
          name="intake"
          value={intake}
          onChange={(e) => setIntake(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Semester:
        </label>
        <input
          type="text"
          name="semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );

  const renderEditCourseForm = () => (
    <form className="flex flex-col space-y-4" onSubmit={handleEditSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Course Name:
        </label>
        <input
          type="text"
          name="courseName"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Intake:
        </label>
        <input
          type="text"
          name="intake"
          value={intake}
          onChange={(e) => setIntake(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Semester:
        </label>
        <input
          type="text"
          name="semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );

  const renderAssignStudentsForm = () => (
    <form className="flex flex-col space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Student Name:
        </label>
        <input
          type="text"
          name="studentName"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Assign
      </button>
    </form>
  );

  const renderAssignTeachersForm = () => (
    <form className="flex flex-col space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Teacher Name:
        </label>
        <input
          type="text"
          name="teacherName"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Assign
      </button>
    </form>
  );

  return (
    <div>
      <div>
        <Dashnav
          universityName={universityName}
          universityInitials={universityInitials}
        />
      </div>

      <div className="flex">
        <AdminSideNav />

        
          <div className="flex-1 mt-28 mr-10 ml-80">
          {loading ? (
            <div className="-mt-36">
          <Loading />
          </div>
        ) : (
            <div>
            <div className="flex justify-center text-center">
              <h1 className="text-xl uppercase bg-green-500 p-2 text-white font-bold">
                Manage Courses
              </h1>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-500"
                onClick={() => togglePopup("Add New Course")}
              >
                Add Courses
              </button>
            </div>

            <div>
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex justify-between bg-slate-200 rounded mt-3 p-5"
                >
                  <div>
                    <h1>Course id: {course.id}</h1>
                    <h1 className="text-2xl font-bold text-green-500 uppercase">
                      {course.name}
                    </h1>
                    <h2 className="text-xl">{course.intake}</h2>
                    <h3 className="text-sm">{course.semester}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-5 text-xs">
                    <button
                      className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      onClick={() => togglePopup("Edit Course", course)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleDeleteCourse(course.id)}
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

            <PopupForm
              show={showPopup}
              handleClose={() => setShowPopup(false)}
              title={popupTitle}
            >
              {popupTitle === "Edit Course" &&
                selectedCourse &&
                renderEditCourseForm()}
              {popupTitle === "Add New Course" && renderAddCourseForm()}
              {popupTitle === "Assign Teachers" && renderAssignTeachersForm()}
              {popupTitle === "Assign Students" && renderAssignStudentsForm()}
            </PopupForm>
          </div>
          )}
          </div>
        
      </div>
    </div>
  );
};

export default ManageCourses;
