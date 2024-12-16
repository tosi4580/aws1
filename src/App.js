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
  const [nextTrainTime, setNextTrainTime] = useState(""); // 次の電車の時間
  const [nextTrainTimeMinus10, setNextTrainTimeMinus10] = useState(""); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000); 
    return () => clearInterval(interval);
  }, []);

  const fetchTimetable = async (direction) => {
    setLoading(true); 
    try {
      const now = new Date();
      now.setHours(now.getHours() + 9); 
      now.setMinutes(now.getMinutes() + 10); 
      const timeString = now.toTimeString().substr(0, 5); 
      const apiUrl = `https://xy2igd6s8k.execute-api.ap-northeast-1.amazonaws.com/prod/TimeTable?time=${timeString}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (direction === 'Northbound') {
        setNorthboundTimetable(data.filter(item => item.railDirection === 'Northbound'));
      } else {
        setSouthboundTimetable(data.filter(item => item.railDirection === 'Southbound'));
      }

      if (data.length > 0) {
        const nextTrain = new Date(data[0].departureTime);
        setNextTrainTime(nextTrain.toLocaleTimeString());
        const nextTrainMinus10 = new Date(nextTrain.getTime() - 10 * 60000);
        setNextTrainTimeMinus10(nextTrainMinus10.toLocaleTimeString());
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
        <h1>研究室から電車に乗るまで</h1>
        <div>現在時刻: {currentTime}</div>
        <div>次の電車の時間: {nextTrainTime}</div>
        <div>: {nextTrainTimeMinus10}までに研究室を出る</div>
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
