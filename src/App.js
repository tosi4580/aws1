import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify, Auth, API } from 'aws-amplify'; 
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
  const [northboundTimetable, setNorthboundTimetable] = useState([]);
  const [southboundTimetable, setSouthboundTimetable] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [closestTrainTime, setClosestTrainTime] = useState(""); 
  const [direction, setDirection] = useState(""); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000); 
    return () => clearInterval(interval);
  }, []);

  const fetchTimetable = async (direction) => {
    setLoading(true);
    setDirection(direction); 
    try {
      const apiUrl = `https://xy2igd6s8k.execute-api.ap-northeast-1.amazonaws.com/prod/timetable`; 

      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log("Fetched data:", data);  

      const now = new Date();
      const tenMinutesLater = new Date(now.getTime() + 10 * 60000);
      let closestTime = "";

      if (direction === 'Northbound') {
        const validTimes = data.northboundTimes.filter(time => new Date(`1970-01-01T${time}:00Z`) > tenMinutesLater);
        closestTime = validTimes[0] || "データなし";
      } else {
        const validTimes = data.southboundTimes.filter(time => new Date(`1970-01-01T${time}:00Z`) > tenMinutesLater);
        closestTime = validTimes[0] || "データなし";
      }

      setClosestTrainTime(closestTime);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false); 
    }
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
