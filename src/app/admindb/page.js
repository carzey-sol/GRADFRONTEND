"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashnav from "../components/dashnav";
import AdminSideNav from "../admincomps/page";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Utility function to handle toast messages
const displayToast = (message, type) => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast(message);
      break;
  }
};

const Page = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [universityId, setUniversityId] = useState(null);
  const [universityInitials, setUniversityInitials] = useState("");

  // Show toast on every page load
  useEffect(() => {
    if (user) {
      displayToast(`Welcome to the Dashboard, ${user.email}!`, "success");
    }
  }, [user]);
  
  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("id");
      console.log("Fetching user details for user ID:", userId);
      const storedEmail = localStorage.getItem('userEmail');
      setUserEmail(storedEmail);

      if (!userId) {
        const errorMessage = "No user ID found in localStorage";
        setError(errorMessage);
        displayToast(errorMessage, "error");
        setLoading(false);
        return;
      }

      try {
        const accessToken = localStorage.getItem("accessToken");
        console.log("Using access token:", accessToken);
        const response = await axios.get(
          `http://localhost:4000/api/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("User data fetched successfully:", response.data);
          setUser(response.data);
          const initials = getInitials(response.data.universityname);
          setUniversityInitials(initials);
          displayToast(`Welcome to the Dashboard, ${response.data.email}!`, "success");
          const userEmail = response.data.email;
          localStorage.setItem("userEmail", userEmail);
          setUniversityId(response.data.universityId);
        } else {
          const errorMessage = "Failed to fetch user details";
          setError(errorMessage);
          displayToast(errorMessage, "error");
          console.log("Failed to fetch user details, status code:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        const errorMessage = "Error fetching user details";
        setError(errorMessage);
        displayToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []); // This effect also runs once when the component mounts

  const getInitials = (name) => {
    if (!name) return "";

    const parts = name.split(" ");
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    } else {
      return (
        parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase()
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
    <ToastContainer />
    <div className="overflow-hidden">
      
      <Dashnav />
      <div className='flex gap-10'>
        <AdminSideNav className="w-1/6 bg-gray-800 py-6">
          {/* Admin side nav content */}
        </AdminSideNav>
        <div className='flex-1 flex flex-col items-center overflow-auto mr-5 ml-80 mt-40'>
          <h1 className="text-2xl font-bold mb-4 pt-3 ">Welcome <span className='bg-green-500 text-white p-2'>{userEmail}</span></h1>
          <img className="w-1/3" src='/landing.png' alt="Landing Page" />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Page;
