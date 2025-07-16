import { useState, useEffect, useMemo } from "react";
import ChartWrapper from "./components/ChartWrapper";
import ControlPanel from "./components/ControlPanel";
import DateDisplay from "./components/DateDisplay";
import { fetchSightings } from "./api/fetchSightings";
import { getWeekStartDate, getWeekEndDate, getWeekNumber } from "./utls";
import TableDisplay from "./components/TableDisplay";

import "./App.css";


function App() {
  const [results, setResults] = useState("");
  const [data, setData] = useState("");
  const [weekData, setWeekData] = useState([]);
  const [weekNo, setWeekNo] = useState(0);
  const [showChart, setShowChart] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [dataLength, setDataLength] = useState(0);

  const getItem = async () => {
    const selectedWeekNo = localStorage.getItem("selWeekNo");
    console.log(selectedWeekNo);
    return selectedWeekNo;
  };

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  //get the data
  useEffect(() => {
    async function loadData() {
      //call api
      const data = await fetchSightings();
      setResults(data);
      const local = await getItem();
      console.log(local);
      if (local) {
        setWeekNo(parseInt(local));
      } else {
        setWeekNo(0);
      }
    }
    loadData();
  }, []);

  //wrangle data
  useEffect(() => {
    if (!results) return;
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
    setWeekData(grouped[weekNo]);
    setWeekNo(weekNo);
    setDataLength(Object.keys(grouped).length);
  }, [results]);

  //function to handle the user clicking backwards
  const handleForwards = () => {
    if (weekNo === dataLength - 1) return;
    setWeekData([data[weekNo + 1]][0]);
    setWeekNo((previous) => previous + 1);
    let tmpWeekNo = weekNo + 1;
    localStorage.setItem("selWeekNo", tmpWeekNo);
  };
  //function to handle the user clicking forwards
  const handleBackwards = () => {
    if (weekNo === 0) return;
    setWeekData([data[weekNo - 1]][0]);
    setWeekNo((previous) => previous - 1);
    let tmpWeekNo = weekNo - 1;
    localStorage.setItem("selWeekNo", tmpWeekNo);
  };

  const toggleChart = () => {
    setShowChart(!showChart);
  };

  const calcWeekly = useMemo(() => {
    return weekData.reduce((sum, item) => sum + item.sightings, 0);
  }, [weekData]);
  const renderChart = () => {
    return showChart && <ChartWrapper data={weekData} />;
  };

  const handleSelect = (e) => {
    setWeekData([data[e.target.value]][0]);
  };

  const handleThemeChange = () => {};
  //show a loading message if the data hasn't been loaded into state yet
  if (weekData.length === 0) {
    return (
      <div className="flex justify-center items-center h-100">Loading...</div>
    );
  } else {
    return (
      <>
        <div className="flex items-center justify-center p-4 my-4">
          <h1 className="text-2xl font-bold">UFO sightings</h1>
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            style={{
              backgroundColor: "var(--button-bg)",
              color: "var(--text-color)",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              marginLeft: "1rem",
              marginRight: "1rem"
            }}
          >
            Toggle {darkMode ? "Light" : "Dark"} Mode
          </button>
        </div>
        <div className="flex items-center justify-around mx-20 my-2">
          <DateDisplay weekData={weekData[0]} />
          <select
            className="bg-pink-200 p-2 rounded"
            name="week-dropdown"
            onChange={handleSelect}
          >
            <option value="">--Select Week Start --</option>
            {Object.keys(data).map((key, index) => (
              <option key={key} value={key}>
                {data[key][0].weekStartDate.toDateString()}
              </option>
            ))}
          </select>
          <button onClick={toggleChart} className="bg-blue-300 rounded p-2">
            {showChart ? "Hide Chart" : "Show Chart"}
          </button>
        </div>
        <div className="flex flex-col items-center justify-center">
          {renderChart()}
          <div className="mb-4 p-2 rounded bg-yellow-400 text-black">
            No of weekly sightings: {calcWeekly}
          </div>
          <ControlPanel
            handleForwards={handleForwards}
            handleBackwards={handleBackwards}
          />
          <TableDisplay data={weekData}/>
        </div>
      </>
    );
  }
}

export default App;
