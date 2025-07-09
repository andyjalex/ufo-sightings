import { useState, useEffect } from "react";
import ChartWrapper from "./components/ChartWrapper";

import "./App.css";

function App() {

  const [data, setData] = useState("")
  
//get the data
  useEffect(() => {
    
    fetch("https://my-json-server.typicode.com/Louis-Procode/ufo-Sightings/ufoSightings"
    ).then((res) => res.json()
    .then((data) => {
      setData(data);
    }));
      
    // async function  fetchData() {
    //   let response = await fetch("https://my-json-server.typicode.com/Louis-Procode/ufo-Sightings/ufoSightings")
    //   let results = await response.json() 
    //   setData(results)
    // }
    //   fetchData()
  },[])

  useEffect(() => {
    if(!data) return
    console.log(data)
    
  },[data])

  ///wrangle it

  //give week 1 to the bar chart
  //forwards and backwards buttons send diffenty data to chart
  console.log(data)
  return (
    <>
      <div className="flex items-center justify-center p-4 my-4">
        <h1 className="text-2xl font-bold">Procode UFO sightings</h1>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ChartWrapper />
        <div className="flex items-center justify-around w-100 mb-8">
          <button className="p-4 cursor-pointer bg-blue-700 rounded">
            Backwards
          </button>
          <button className="p-4 cursor-pointer bg-blue-700 rounded">
            Forwards
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
