import React from "react";

const MgsubPopupForm = ({ handleClose, show, title, formContent, subjectName, setSubjectName, handleFormSubmit }) => {
  const showHideClassName = show ? "fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center" : "hidden";

  return (
    <div className={showHideClassName}>
      <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl mb-4">{title}</h2>
        {formContent ? (
          formContent // Render the form content received as prop
        ) : (
          <p>No form content available.</p>
        )}
        {/* Close button */}
        <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default MgsubPopupForm;
