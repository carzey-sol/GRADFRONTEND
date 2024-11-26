import React from "react";

const PopupForm = ({
  handleClose,
  show,
  title,
  formContent,
  teacherName,
  setTeacherName,
  handleFormSubmit,
}) => {
  const showHideClassName = show ? "modal fixed inset-0 flex items-center justify-center z-50" : "modal hidden";

  return (
    <div className={showHideClassName}>
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="modal-content py-4 text-left px-6">
          <div className="modal-header flex justify-between items-center pb-3">
            <p className="text-2xl font-bold">{title}</p>
            <button className="modal-close text-3xl leading-none" onClick={handleClose}>&times;</button>
          </div>
          <div className="modal-body">{formContent}</div>
        </div>
      </div>
    </div>
  );
};

export default PopupForm;
