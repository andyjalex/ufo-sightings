const ControlPanel = ({handleForwards, handleBackwards}) => {
  return (
    <div className="flex items-center justify-around w-100 mb-8">
      <button
        onClick={() => handleBackwards()}
        className="p-4 cursor-pointer bg-blue-700 rounded"
      >
        Backwards
      </button>
      <button
        onClick={() => handleForwards()}
        className="p-4 cursor-pointer bg-blue-700 rounded"
      >
        Forwards
      </button>
    </div>
  );
};

export default ControlPanel;
