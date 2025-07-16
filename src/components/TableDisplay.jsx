const TableDisplay = ({ data }) => {
  console.log(data);
  return (
    <div className="flex flex-col items-center justify-center">
      {data.map((item) => {
        return (
          <div className="font-white">
            {item.sightings}
            {item.dateTime.toString()}
          </div>
        );
      })}
    </div>
  );
};

export default TableDisplay;
