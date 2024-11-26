const popupForm = ({ handleClose, show, title, children }) => {
  const showHideClassName = show ? "fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center" : "hidden";

  return (
    <div className={showHideClassName}>
      <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl mb-4">{title}</h2>
        {children}
        <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default popupForm;
