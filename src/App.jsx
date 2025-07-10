import { useState, useEffect } from "react";
import ChartWrapper from "./components/ChartWrapper";

import "./App.css";

function App() {
  const [results, setResults] = useState("");
  const [data, setData] = useState("");
  const [weekData, setWeekData] = useState("");
  const [weekNo, setWeekNo] = useState(0);

  const [dataLength, setDataLength] = useState(0);

  //get the data
  useEffect(() => {
    fetch(
      "https://my-json-server.typicode.com/Louis-Procode/ufo-Sightings/ufoSightings"
    ).then((res) =>
      res.json().then((data) => {
        setResults(data);
      })
    );

    // async function  fetchData() {
    //   let response = await fetch("https://my-json-server.typicode.com/Louis-Procode/ufo-Sightings/ufoSightings")
    //   let results = await response.json()
    //   setData(results)
    // }
    //   fetchData()
  }, []);

  function getWeekStartDate(date) {
    const cloned = new Date(date); // clone to avoid mutation
    const day = cloned.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = cloned.getDate() - day + (day === 0 ? -6 : 1); // adjust when Sunday
    cloned.setDate(diff);
    return cloned;
  }

  function getWeekEndDate(date) {
    const cloned = new Date(date); // clone to avoid mutation
    cloned.setDate(cloned.getDate() + 6);
    return cloned;
  }
  function getWeekNumber(date) {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);

    // Thursday in current week decides the year
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));

    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    const diff = (tempDate - week1) / (1000 * 60 * 60 * 24);
    return 1 + Math.floor(diff / 7);
  }
  //wrangle data
  useEffect(() => {
    if (!results) return;
    //create date field
    //create weekdayName field
    //create week number
    const newData = results.map((item) => {
      const [day, month, year] = item.date.split("/");
      const dateTime = new Date(year, month - 1, day);
      const weekDayName = dateTime.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const weekNumber = getWeekNumber(dateTime) - 10; //normalise
      const weekStartDate = getWeekStartDate(dateTime);

      const weekEndDate = getWeekEndDate(weekStartDate);

      console.log("weekstartdate", weekStartDate);
      console.log("weekEndDate", weekEndDate);
      return {
        sightings: item.sightings,
        dateTime: dateTime,
        weekNumber: weekNumber,
        weekStartDate: weekStartDate,
        weekEndDate: weekEndDate,
        weekDayName: weekDayName,
      };
    });

    const grouped = newData.reduce((acc, item) => {
      const key = item.weekNumber;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    console.log("newdata", grouped[0]);
    setData(grouped);
    setWeekData(grouped[0]);
    setWeekNo(0);
    setDataLength(Object.keys(grouped).length);
  }, [results]);

  const handleForwards = () => {
    if (weekNo === dataLength - 1) return;
    setWeekData([data[weekNo + 1]][0]);
    setWeekNo((previous) => previous + 1);
  };

  const handleBackwards = () => {
    if (weekNo === 0) return;
    setWeekData([data[weekNo - 1]][0]);
    setWeekNo((previous) => previous - 1);
  };

  const renderChart = () => {
    return <ChartWrapper data={weekData} />;
  };

  //forwards and backwards buttons send diffenty data to chart

  if (!weekData) {
    return (
      <div className="flex justify-center items-center h-100">No data</div>
    );
  } else {
    console.log(weekData);
    return (
      <>
        <div className="flex items-center justify-center p-4 my-4">
          <h1 className="text-2xl font-bold">UFO sightings</h1>
        </div>
        <div className="flex items-center justify-center mx-20 my-2">
          <h2>
            {weekData[0].weekStartDate.toDateString()} —{" "}
            {weekData[0].weekEndDate.toDateString()}
          </h2>{" "}
        </div>
        <div className="flex flex-col items-center justify-center">

          {renderChart()}

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
        </div>
      </>
    );
  }
}

export default App;
