import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashnav = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [universityInitials, setUniversityInitials] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("id");
      console.log("Fetching user details for user ID:", userId);

      if (!userId) {
        setError("No user ID found in localStorage");
        setToastMessage("No user ID found in localStorage");
        setToastType("error");
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
          setUniversityInitials(getInitials(response.data.universityname));
          localStorage.setItem("universityId", response.data.university_id); // Save universityId to localStorage
          setToastMessage(`Welcome to the Dashboard, ${response.data.email}!`);
          setToastType("success");
        } else {
          setError("Failed to fetch user details");
          setToastMessage("Failed to fetch user details");
          setToastType("error");
          console.log(
            "Failed to fetch user details, status code:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Error fetching user details");
        setToastMessage("Error fetching user details");
        setToastType("error");
      }
    };

    fetchUserDetails();
  }, []);

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

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login"; // Redirect to login page or home page
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="bg-white shadow-md p-4 w-full fixed z-50">
      <div className="flex justify-between items-center w-full">
        <div className="text-3xl font-bold cursor-pointer">
          <h1>GraD<span className="text-green-700">.</span></h1>
        </div>

        <div className="text-2xl font-bold cursor-pointer">
          <h1>{user ? user.universityname : "University"}</h1>
        </div>

        <div className="relative">
          <div
            className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white text-xl cursor-pointer"
            onClick={togglePopup}
          >
            {universityInitials || "UN"}
          </div>

          {showPopup && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashnav;
