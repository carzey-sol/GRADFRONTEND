"use client"
import { useEffect, useState } from 'react';
import Dashnav from '../../components/dashnav';
import TeacherNav from '../teacherNav'

const Dashboard = ({ universityName, universityInitials }) => {
  const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem('id');
      const accessToken = localStorage.getItem('accessToken');

      if (userId && accessToken) {
        try {
          const response = await fetch(`http://localhost:4000/api/profile/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserDetails({ firstName: data.first_name, lastName: data.last_name });
          } else {
            console.error('Failed to fetch user details');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="overflow-hidden">
      <Dashnav universityName={universityName} universityInitials={universityInitials} />
      <TeacherNav />
      <div className='flex gap-10 '>
        <div className='flex-1 flex flex-col items-center overflow-auto mr-5 ml-80 mt-40'>
          <h1 className="text-2xl font-bold mb-4 pt-3">
            Welcome <span className='bg-green-500 text-white p-2'>{userDetails.firstName + ' ' + userDetails.lastName}</span>
          </h1>
          <img className="w-1/3" src='/landing.png' alt="Landing Page" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
