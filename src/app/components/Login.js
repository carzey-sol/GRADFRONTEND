"use client"
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful. Access Token:", data.accessToken);
        console.log("Received Data:", data);

        // Decode the token to get the payload
        const decodedToken = JSON.parse(atob(data.accessToken.split('.')[1]));
        console.log("Decoded Token:", decodedToken);

        // Store user ID, email, and access token in localStorage
        localStorage.setItem('id', decodedToken.id);
        localStorage.setItem('email', email);  // Store the email
        localStorage.setItem('accessToken', data.accessToken);

        // Verify if data is stored correctly
        console.log('Stored ID:', localStorage.getItem('id'));
        console.log('Stored Email:', localStorage.getItem('userEmail'));
        console.log('Stored AccessToken:', localStorage.getItem('accessToken'));

        // Redirect based on role
        switch (decodedToken.roleId) {
          case 1: // Admin role
            router.push('/admincomps/dashboard');
            break;
          case 2: // Teacher role
            router.push('/teachercomps/dashboard');
            break;
          case 3: // Student role
            router.push('/studentcomps/studentdashboard');
            break;
          default:
            console.log('Unknown role ID:', decodedToken.roleId);
            break;
        }
      } else {
        const errorText = await response.json();
        setError(errorText.message);
        console.error("Login failed:", errorText);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Error during login. Please try again later.");
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/dashboard/admin", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/login');
      }
    };

    checkAuthentication();
  }, [router]);

  return (
    <div>
      <div className="min-h-screen scale-95 -mt-20 flex items-center justify-center p-5 md:-mt-12">
        <div className="bg-gray-100 flex items-center justify-center rounded-2xl shadow-lg max-w-3xl p-5 ">
          <div className="mr-10 w-1/2 overflow-hidden">
            <h2 className="font-bold text-3xl">Login</h2>
            <p className="text-sm mt-4">
              Please use your organization provided credentials to login.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col mt-5">
              <input
                className="p-2 mt-8 rounded-xl"
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                className="p-2 mt-8 rounded-xl"
                type="password"
                name="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <span className="text-red-500 text-sm mt-2 ">{error}</span>} 

              <button className="mt-8 bg-green-600 p-2 rounded-xl hover:bg-green-400 hover:font-bold ease-in-out duration-300">
                Login
              </button>
              <div className="mt-2 flex flex-col text-center">
                <span className="font-bold">OR</span>
              </div>
            </form>
            <button className="bg-yellow-300 w-full p-2 mt-2 rounded-xl text-sm hover:bg-yellow-400 ease-in-out duration-300">
              Register your organization
            </button>
          </div>

          <div className="w-1/2">
            <img className="rounded-2xl" src="/Login.jpg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
