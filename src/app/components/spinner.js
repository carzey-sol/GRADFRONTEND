// spinner.js
import React from 'react';
import BarLoader from "react-spinners/BarLoader";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <BarLoader color="#13e510" speedMultiplier={2} />
    </div>
  );
};

export default Spinner;
