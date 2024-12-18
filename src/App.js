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
      const now = new Date();
      now.setMinutes(now.getMinutes() + 10); 
      const timeString = now.toTimeString().substr(0, 5); 
      const apiUrl = `https://xy2igd6s8k.execute-api.ap-northeast-1.amazonaws.com/prod/TimeTable?time=${timeString}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      let timetable = [];
      if (direction === 'Northbound') {
        timetable = data.filter(item => item.railDirection === 'Northbound');
        setNorthboundTimetable(timetable);
      } else {
        timetable = data.filter(item => item.railDirection === 'Southbound');
        setSouthboundTimetable(timetable);
      }

      if (timetable.length > 0) {
        const currentPlus10 = new Date();
        currentPlus10.setMinutes(currentPlus10.getMinutes() + 10);
        const closest = timetable.reduce((prev, curr) => {
          const prevTime = new Date();
          const [prevHour, prevMinute] = prev.departureTime.split(':').map(Number);
          prevTime.setHours(prevHour);
          prevTime.setMinutes(prevMinute);

          const currTime = new Date();
          const [currHour, currMinute] = curr.departureTime.split(':').map(Number);
          currTime.setHours(currHour);
          currTime.setMinutes(currMinute);

          return Math.abs(currTime - currentPlus10) < Math.abs(prevTime - currentPlus10) ? curr : prev;
        });
        setClosestTrainTime(closest.departureTime);
      } else {
        setClosestTrainTime(""); 
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>次の電車</h1>
        <div>現在時刻: {currentTime}</div>
        <div>{closestTrainTime}</div>
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
