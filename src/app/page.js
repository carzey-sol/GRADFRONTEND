"use client"
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import { Poppins } from "next/font/google";



export default function Home() {
  const router = useRouter();
  const navigate = (name) =>{
    router.push(name);
  }
  return (
    
    
    <div className="mt-10 ml-10 mr-10 ">
    <Navbar/>
    <div className="flex flex-col justify-center text-center mt-10 md:mt-0">
    <h1 className="text-4xl ">Welcome to GraD<span className="font-bold text-green-600">.LMS</span></h1>
    <p className="mt-5 text-xs">Get started to enhance your learning and teaching experience!</p>
      <div className="flex justify-center md:-mt-20 ">
      <img src="/landing.png" className="h-1/2 w-1/2 mt-10 md:-mt-31 md:h-1/3 md:w-1/3 "  />
      </div>
      <div className="md:-mt-10">
       <div className="flex justify-center gap-5 mt-10">
       <buton className="bg-green-600 px-5 py-1 rounded text-white hover:bg-green-400 hover:text-black hover:font-bold" onClick={() => navigate("/login")}>Login</buton>
       <buton  className="px-5 py-1 hover:text-green-600 font-bold" onClick={() => navigate("/signup")}>Sign Up</buton>
       </div>
      </div>
    </div>
    </div>
  );
}
