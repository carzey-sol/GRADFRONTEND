"use client"
import React, { useEffect, useState } from 'react';
import Dashnav from "@/app/components/dashnav";
import TeacherNav from "../teacherNav";
import Loading from "../../components/loading";

const Subjects = ({ universityName, universityInitials }) => {
  const [courseName, setCourseName] = useState('');
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoading(false);
    }, 1000);

    const email = localStorage.getItem('email');

    if (email) {
      fetch(`http://localhost:4000/api/myCourses/${email}`)
        .then(response => response.json())
        .then(data => {
          setCourseName(data.courseName);
          setStudentCount(data.studentCount);
          setLoading(false);
          clearTimeout(timeout);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
          clearTimeout(timeout);
        });
    } else {
      setLoading(false);
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 1000);

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
          <Loading />
        ) : (
          <div>
            <div className="flex ml-80 mt-32 justify-center item">
              <h1 className="text-xl uppercase font-bold bg-green-500 p-2 text-white">My Course</h1>
            </div>
            <div className="ml-80 flex">
              <div className="p-4 border rounded shadow w-72 flex justify-between">
                <div>
                  <h1 className="uppercase text-5xl font-bold">{courseName}</h1>
                </div>
                <div className="bg-green-500 p-3 text-white font-bold">
                  <h1 className="text-sm">Students Enrolled</h1>
                  <p className="text-5xl">{studentCount}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
