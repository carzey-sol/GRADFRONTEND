"use client"
const React = require('react');
const { useState } = require('react');

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, universityName }),
      });
      if (response.ok) {
        setShowPopup(true); // Show popup on successful registration
      } else {
        console.error('Signup failed:', await response.text());
      }
    } catch (error) {
      console.error('Error during signup', error);
    }
  };

  const Popup = () => (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md text-center">
        <p className="font-bold text-xl mb-4">You are registered, please proceed to login</p>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700" onClick={() => {
          setShowPopup(false);
          window.location.href = '/login'; // Redirect to login page
        }}>
          OK
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {showPopup && <Popup />}
      <div className="min-h-screen scale-95 -mt-20 flex items-center justify-center p-5 md:-mt-12">
        <div className="bg-gray-100 flex items-center justify-center rounded-2xl shadow-lg max-w-3xl p-5 ">
          <div className="mr-10 w-1/2 overflow-hidden">
            <h2 className="font-bold text-3xl">Signup</h2>
            <p className="text-sm mt-4">Register Your University and enhance learning and teaching experience</p>
            <form action="#" className="flex flex-col mt-5">
              <input className="p-2 mt-8 rounded-xl" type="email" name="email" placeholder="Official Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="p-2 mt-8 rounded-xl" type="text" name="uniname" placeholder="University Name" value={universityName} onChange={(e) => setUniversityName(e.target.value)} />
              <input className="p-2 mt-8 rounded-xl" type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

              <button className="mt-8 bg-yellow-300 p-2 rounded-xl text-sm hover:bg-yellow-400 ease-in-out duration-300" onClick={handleSubmit}>Register your organization</button>
              <div className="mt-2 flex flex-col text-center">
                <span className="font-bold">OR</span>
              </div>
            </form>
            <button className="w-full mt-2 bg-green-600 p-2 rounded-xl hover:bg-green-400 hover:font-bold ease-in-out duration-300">Login</button>
          </div>
          <div className="w-1/2">
            <img className="rounded-2xl" src="/Login.jpg" alt="Login" />
          </div>
        </div>
      </div>
    </div>
  );
};

module.exports = Signup;
