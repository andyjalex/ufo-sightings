const DateDisplay = ({weekData}) => {
  return (
    <h2 className="bg-pink-700 p-2 mb-2 rounded">
      {weekData.weekStartDate.toDateString()} —{" "}
      {weekData.weekEndDate.toDateString()}
    </h2>
  );
};

export default DateDisplay;
