"use client"
import React, { useEffect, useState } from 'react';
import Dashnav from "@/app/components/dashnav";
import TeacherNav from "../teacherNav";
import Loading from "../../components/loading";

const Subjects = ({ universityName, universityInitials }) => {
  const [subjects, setSubjects] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Timer to ensure spinner shows for at least 1 second
    const timeout = setTimeout(() => {
      setShowLoading(false);  // Stop showing loading spinner after 1 second
    }, 1000);

    const email = localStorage.getItem('email');

    if (email) {
      fetch(`http://localhost:4000/api/mySubjects/${email}`)
        .then(response => response.json())
        .then(data => {
          setSubjects(data.subjects);
          setCourseName(data.courseName);
          setStudentCount(data.studentCount);
          setLoading(false);
          clearTimeout(timeout);  // Clear timeout when data is fetched
          // Ensure showLoading is false only if 1 second has passed
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
          clearTimeout(timeout);  // Clear timeout in case of error
          // Ensure showLoading is false only if 1 second has passed
        });
    } else {
      setLoading(false);
      clearTimeout(timeout);  // Clear timeout if no email
      // Ensure showLoading is false only if 1 second has passed
    }
    
    // Cleanup timeout if the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  // Use a delayed state to ensure spinner shows for at least 1 second
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 1000); // Ensure spinner is shown for at least 1 second

      return () => clearTimeout(timer);
    }
  }, [loading]);

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
          <Loading />  // Show loading spinner for at least 1 second
        ) : (
          <div>
            <div className="flex ml-80 mt-32 justify-center">
              <h1 className="text-xl uppercase font-bold bg-green-500 p-2 text-white">My Subjects</h1>
            </div>
            <div className="ml-80 grid grid-cols-3 gap-4 mt-5 mr-12">
              {subjects.map((subject) => (
                <div key={subject.id} className="p-4 border rounded shadow w-72 flex justify-between">
                  <div>
                    <h1 className="uppercase">{subject.name}</h1>
                    <p className="text-xs">{courseName}</p>
                  </div>
                  <div className="bg-green-500 p-3 text-white font-bold">
                    <h1 className="text-sm">Students Enrolled</h1>
                    <p className="text-5xl">{studentCount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
