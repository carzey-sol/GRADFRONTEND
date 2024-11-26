"use client";

import { useEffect, useState } from 'react';
import Dashnav from '../../components/dashnav';
import AdminSideNav from '../page';
import Loading from '../../components/loading'; // Ensure you have a Loading component
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { saveAs } from 'file-saver';
import Papa from 'papaparse'; // For converting JSON to CSV

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = ({ universityName, universityInitials }) => {
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoading(false);  // Stop showing loading spinner after 1 second
    }, 1000);

    const storedEmail = localStorage.getItem('email');
    const universityId = localStorage.getItem('universityId');  // Retrieve university ID from localStorage
    setUserEmail(storedEmail);

    // Fetch data from the backend API with universityId as a query parameter
    fetch(`${API_URL}/api/barchart/student?universityId=${universityId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        setTotalStudents(data.totalStudents);
        setChartData(data.chartData);
        setLoading(false);
        clearTimeout(timeout);  // Clear timeout when data is loaded or immediately if loading is complete
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
        clearTimeout(timeout);
      });

    return () => clearTimeout(timeout);
  }, [API_URL]);

  useEffect(() => {
    // Use a delayed state to ensure spinner shows for at least 1 second
    if (!loading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 1000); // Ensure spinner is shown for at least 1 second

      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Function to handle export as CSV
  const handleExportCSV = () => {
    if (!chartData) return;

    // Convert the chart data to CSV format
    const csvData = chartData.labels.map((label, i) => ({
      Course: label,
      Students: chartData.datasets[0].data[i],
    }));

    const csv = Papa.unparse(csvData);

    // Trigger file download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'student_data.csv');
  };

  return (
    <div className="overflow-hidden relative">
      <Dashnav universityName={universityName} universityInitials={universityInitials} />
      <div className='flex gap-10'>
        <AdminSideNav className="w-1/6 bg-gray-800 py-6"> {/* Ensure AdminSideNav has a fixed width */}
          {/* Admin side nav content */}
        </AdminSideNav>
        <div className='flex-1 flex flex-col items-center overflow-auto mr-5 ml-80 mt-32'>
          {showLoading ? (
            <div className="-mt-36">
              <Loading />   
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4 pt-3">Welcome <span className='bg-green-500 text-white p-2'>{userEmail}</span></h1>
              <div className="flex flex-col items-center justify-center mt-12">
                <h2 className="text-xl font-semibold mt-6">Total Students: {totalStudents}</h2>
                {error && <p className="text-red-500">{error}</p>}
                {chartData && (
                  <div className="w-full max-w-lg mt-8"> {/* Adjust max-w-lg to reduce size */}
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true, // Allow the chart to scale according to container size
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(tooltipItem) {
                                return `Count: ${tooltipItem.raw}`;
                              }
                            }
                          }
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Courses'
                            }
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Number of Students'
                            }
                          }
                        }
                      }}
                      style={{ height: '300px', width: '100%' }} // Set height and width
                    />
                    {/* Export button */}
                    <button
  onClick={handleExportCSV}
  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto block"
>
  Export as CSV
</button>

                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
