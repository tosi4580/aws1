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
  const [firstNorthboundTime, setFirstNorthboundTime] = useState(""); 
  const [firstSouthboundTime, setFirstSouthboundTime] = useState(""); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000); 
    return () => clearInterval(interval);
  }, []);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const apiUrl = `https://xy2igd6s8k.execute-api.ap-northeast-1.amazonaws.com/prod/TimeTable`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      const northbound = data.filter(item => item.railDirection === 'Northbound');
      const southbound = data.filter(item => item.railDirection === 'Southbound');

      setNorthboundTimetable(northbound);
      setSouthboundTimetable(southbound);

      if (northbound.length > 0) {
        setFirstNorthboundTime(northbound[0].departureTime);
      }

      if (southbound.length > 0) {
        setFirstSouthboundTime(southbound[0].departureTime);
      }
      
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>次の電車</h1>
        <div>現在時刻: {currentTime}</div>
        <div>最初の北行き電車の時間: {firstNorthboundTime}</div>
        <div>最初の南行き電車の時間: {firstSouthboundTime}</div>
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
