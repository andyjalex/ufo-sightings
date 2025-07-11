import { useState, useEffect } from "react";
import ChartWrapper from "./components/ChartWrapper";
import ControlPanel from "./components/ControlPanel";
import DateDisplay from "./components/DateDisplay";
import { fetchSightings } from "./api/fetchSightings";
import { getWeekStartDate, getWeekEndDate, getWeekNumber } from "./utls";

import "./App.css";

function App() {
  const [results, setResults] = useState("");
  const [data, setData] = useState("");
  const [weekData, setWeekData] = useState("");
  const [weekNo, setWeekNo] = useState(0);

  const [dataLength, setDataLength] = useState(0);

  //get the data
  useEffect(() => {
    async function loadData() {
      //call api
      const data = await fetchSightings();
      setResults(data);
    }
    loadData();
  }, []);

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

  if (!weekData) {
    return (
      <div className="flex justify-center items-center h-100">Loading...</div>
    );
  } else {
    return (
      <>
        <div className="flex items-center justify-center p-4 my-4">
          <h1 className="text-2xl font-bold">UFO sightings</h1>
        </div>
        <div className="flex items-center justify-center mx-20 my-2">
          <DateDisplay weekData={weekData[0]} />
        </div>
        <div className="flex flex-col items-center justify-center">
          {renderChart()}
          <ControlPanel
            handleForwards={handleForwards}
            handleBackwards={handleBackwards}
          />
        </div>
      </>
    );
  }
}

export default App;
