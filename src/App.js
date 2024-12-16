import React, { useState, useEffect } from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { API } from 'aws-amplify';

Amplify.configure(awsconfig);

function App() {
  const [northboundTimetable, setNorthboundTimetable] = useState([]);
  const [southboundTimetable, setSouthboundTimetable] = useState([]);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const now = new Date();
      now.setHours(now.getHours() + 9); 
      now.setMinutes(now.getMinutes() + 10); 
      const timeString = now.toTimeString().substr(0, 5); 
      const apiUrl = `https://xy2igd6s8k.execute-api.ap-northeast-1.amazonaws.com/prod/TimeTable?time=${timeString}`;

      const response = await fetch(apiUrl);
      const data = await response.json();
      
      const northbound = data.filter(item => item.railDirection === 'Northbound');
      const southbound = data.filter(item => item.railDirection === 'Southbound');
      
      setNorthboundTimetable(northbound);
      setSouthboundTimetable(southbound);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>次の電車</h1>
        <div>
          <h2>上北台行き (北行き)</h2>
          <ul>
            {northboundTimetable.map((item, index) => (
              <li key={index}>
                {item.station} - {item.departureTime} - {item.destinationStation}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>多摩センター行き (南行き)</h2>
          <ul>
            {southboundTimetable.map((item, index) => (
              <li key={index}>
                {item.station} - {item.departureTime} - {item.destinationStation}
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
