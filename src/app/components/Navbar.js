"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const navigate = (name) => {
    router.push(name);
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const toogleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <div className="flex justify-between align-middle">
        <div>
          <div
            className=" text-3xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            GraD<span className="text-green-600">.</span>
          </div>
        </div>
        <div className="-mr-24 md:mr-0">
          <div >
            <div>
            <div>
              <img
                className=" md:hidden mt-2 scale-150 cursor-pointer "
                src={menuOpen ? "close.svg" : "hamburger.svg"}
                onClick={toogleMenu}
              />
            </div>
            </div>
          </div>

          <div className="invisible md:visible text-black flex justify-between mt-2">
            <button
              onClick={() => navigate("/signup")}
              className=" bg-green-600 px-1 py-2 rounded  font-semibold text-white"
            >
              Sign Up
            </button>

            <button
              onClick={() => navigate("/login")}
              className="ml-5 px-1 py-2 font-semibold text-green-600"
            >
              Login
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="z-10">
          <div className="flex flex-col gap-5 bg-green-500 p-2 font-bold  cursor-pointer text-white md:hidden">
            <span onClick={() => navigate("/signup")}>Sign Up</span>
            <span onClick={() => navigate("/login")}>Login</span>
            <div className="flex justify-center gap-5 mt-10">
              <img className="h-10 w-10" src="Logowhite.png" />
              <p className="text-sm font-medium  mt-2">
                GraD - All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Navbar;
