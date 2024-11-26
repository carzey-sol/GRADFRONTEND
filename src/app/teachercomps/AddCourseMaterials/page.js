"use client";
import React, { useState, useEffect } from "react";
import Dashnav from "@/app/components/dashnav";
import TeacherNav from "../teacherNav";
import axios from "axios";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { pdfjs } from "react-pdf";
import { FaCloudDownloadAlt } from "react-icons/fa";

// Set up the worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AddCourseMaterials = ({ universityName, universityInitials }) => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [materials, setMaterials] = useState([]);
  const [showAddMaterialForm, setShowAddMaterialForm] = useState(false);
  const [universityId, setUniversityId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUniversityId(localStorage.getItem("universityId"));
    }

    const fetchCoursesForTeacher = async () => {
      const email = localStorage.getItem("email");
      try {
        const teacherResponse = await axios.get(
          `http://localhost:4000/api/uploadCourseMaterials/teacher?email=${email}`
        );
        const courseId = teacherResponse.data.course_id;

        const coursesResponse = await axios.get(
          `http://localhost:4000/api/uploadCourseMaterials/courses?course_id=${courseId}`
        );
        setCourses(coursesResponse.data);

        const subjectsResponse = await axios.get(
          `http://localhost:4000/api/uploadCourseMaterials/subjects?course_id=${courseId}`
        );
        setSubjects(subjectsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCoursesForTeacher();
  }, []);

  const handleUploadMaterials = async (courseId, subjectId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/uploadCourseMaterials/materials?course_id=${courseId}&subject_id=${subjectId}`
      );
      setMaterials(response.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const handleAddMaterial = (newMaterial) => {
    setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
  };

  return (
    <div className="flex">
      <Dashnav
        universityName={universityName}
        universityInitials={universityInitials}
       
      />
      <TeacherNav />
      <div className="flex-1 p-4 ml-80 mt-28">
        <div className="flex justify-center">
          <h2 className="text-xl font-bold mb-4 uppercase bg-green-500 p-2 text-white">
            Upload Course Materials
          </h2>
        </div>

        <div className="flex justify-between p-5 mb-4">
          <label className="flex flex-col">
            Course
            <select
              className="border px-20 rounded"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option value="" disabled hidden>
                Choose Course
              </option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            Subject
            <select
              className="border px-20 rounded"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={!course}
            >
              <option value="" disabled hidden>
                Choose Subject
              </option>
              {subjects
                .filter((s) => s.course_id === parseInt(course))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </label>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => handleUploadMaterials(course, subject)}
          >
            OK
          </button>
        </div>

        <div>
        {materials.map((material, index) => (
  <div key={index} className="border rounded mb-10 uppercase pt-5 pb-5">
    <div className="text-xs ml-5">
      <span>Material ID:</span> {material.id}
    </div>
    <div className="text-3xl font-bold text-green-500 ml-5">
      {material.name}
    </div>
    <div className="ml-5">
      <span>Description:</span> {material.description}
    </div>
    <div className="ml-5 mb-5">
      <span>Subject Id:</span> {material.subject_id}
    </div>
    <div className="ml-5 mb-5">
    <a href={material.file_path} target="_blank" rel="noopener noreferrer"><button className="flex items-center gap-2 bg-green-500 rounded p-2">Download <FaCloudDownloadAlt /></button></a>
    </div>

    <div style={{ width: '100%', height: '50vh', overflow: 'auto' }}>
      <div style={{ width: '100%', height: '100%' }}>
        <Worker
          workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`}
        >
          <Viewer fileUrl={material.file_path} />
        </Worker>
      </div>
    </div>
  </div>
))}

        </div>

        <div className="fixed bottom-4 right-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => setShowAddMaterialForm(true)}
          >
            Add New Course Material
          </button>
        </div>

        {showAddMaterialForm && (
          <AddMaterialForm
            courses={courses}
            subjects={subjects}
            onAdd={handleAddMaterial}
            onCancel={() => setShowAddMaterialForm(false)}
            universityId={universityId}
          />
        )}
      </div>
    </div>
  );
};

const AddMaterialForm = ({
  courses,
  subjects,
  onAdd,
  onCancel,
  universityId,
}) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [attachments, setAttachments] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const handleFileChange = (e) => {
    setAttachments(e.target.files[0]);
  };

  const handleAdd = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("details", details);
    formData.append("courseId", selectedCourse);
    formData.append("subjectId", selectedSubject);
    formData.append("universityId", universityId);
    formData.append("file", attachments);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/uploadCourseMaterials/uploadmaterials",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const newMaterial = {
        id: response.data.materialId,
        name: title,
        description: details,
        subject_id: selectedSubject,
        file_path: response.data.fileUrl,
      };
      onAdd(newMaterial);
    } catch (error) {
      console.error("Error uploading material:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add New Course Material</h2>
        <label className="block mb-2">
          Course
          <select
            className="border p-2 w-full rounded"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="" disabled hidden>
              Select Course
            </option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block mb-2">
          Subject
          <select
            className="border p-2 w-full rounded"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedCourse}
          >
            <option value="" disabled hidden>
              Select Subject
            </option>
            {subjects
              .filter(
                (subject) => subject.course_id === parseInt(selectedCourse)
              )
              .map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
          </select>
        </label>
        <label className="block mb-2">
          Title
          <input
            className="border p-2 w-full rounded"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="block mb-2">
          Details
          <textarea
            className="border p-2 w-full rounded"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          ></textarea>
        </label>
        <label className="block mb-4">
          Attachments
          <input
            className="border p-2 w-full rounded"
            type="file"
            onChange={handleFileChange}
          />
        </label>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleAdd}
          >
            Add
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCourseMaterials;
