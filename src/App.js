import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify, Auth, API } from 'aws-amplify'; 
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
  let [northboundTimetable, setNorthboundTimetable] = useState([]);
  let [southboundTimetable, setSouthboundTimetable] = useState([]);
  let [loading, setLoading] = useState(false); 
  let [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  let [closestTrainTime, setClosestTrainTime] = useState(""); 
  let [direction, setDirection] = useState(""); 

  useEffect(() => {
    let interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000); 
    return () => clearInterval(interval);
  }, []);

  let fetchTimetable = async (direction) => {
    setLoading(true);
    setDirection(direction); 
    try {
      let apiUrl = `https://xy2igd6s8k.execute-api.ap-northeast-1.amazonaws.com/prod/timetable`; 

      let response = await fetch(apiUrl);
      let data = await response.json();

      console.log("Fetched data:", data);  

      let now = new Date();
      let tenMinutesLater = new Date(now.getTime() + 10 * 60000);
      let closestTime = "";

      if (direction === 'Northbound') {
        let timesArray = data.northboundTimes || [data.nextNorthboundTime];
        closestTime = findValidTime(timesArray, tenMinutesLater);
      } else {
        let timesArray = data.southboundTimes || [data.nextSouthboundTime];
        closestTime = findValidTime(timesArray, tenMinutesLater);
      }

      setClosestTrainTime(closestTime);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false); 
    }
  };

  let findValidTime = (timesArray, tenMinutesLater) => {
    for (let i = 0; i < timesArray.length; i++) {
      let [hour, minute] = timesArray[i].split(':').map(Number);
      let nextTime = new Date();
      nextTime.setHours(hour, minute, 0, 0);

      if (nextTime > tenMinutesLater) {
        return timesArray[i];
      }
    }
    return "データなし";
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>おうちに帰ろう</h1>
        <div>現在時刻: {currentTime}</div>
        <div>{direction === 'Northbound' ? '上北台行き' : '多摩センター行き'}の次の電車: {closestTrainTime}</div>
        <div className="button-container">
          <button onClick={() => fetchTimetable('Northbound')} disabled={loading} className="fetch-button">
            {loading ? '読み込み中...' : '上北台行き'}
          </button>
          <button onClick={() => fetchTimetable('Southbound')} disabled={loading} className="fetch-button">
            {loading ? '読み込み中...' : '多摩センター行き'}
          </button>
        </div>
      </header>
      <div>
        <ul>
          {northboundTimetable.map((item, index) => (
            <li key={index}>
              {item.station} - {item.departureTime} - {item.destinationStation}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ul>
          {southboundTimetable.map((item, index) => (
            <li key={index}>
              {item.station} - {item.departureTime} - {item.destinationStation}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
