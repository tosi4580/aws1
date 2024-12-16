import React, { useState } from 'react';
import './App.css';
import { Amplify, Auth, API } from 'aws-amplify'; 
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
  const [northboundTimetable, setNorthboundTimetable] = useState([]);
  const [southboundTimetable, setSouthboundTimetable] = useState([]);
  const [loading, setLoading] = useState(false); // ローディング状態を追加
  const [currentTime, setCurrentTime] = useState(""); // 現在の時刻を保存

  const fetchTimetable = async (direction) => {
    setLoading(true); // ローディング状態を設定
    try {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString()); // 現在の時刻を保存
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
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false); // ローディング状態を解除
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>次の電車</h1>
        <div>次の電車は {currentTime}</div>
        <div className="button-container">
          <button onClick={() => fetchTimetable('Northbound')} disabled={loading} className="fetch-button">
            {loading ? '読み込み中...' : '上北台行き'}
          </button>
          <button onClick={() => fetchTimetable('Southbound')} disabled={loading} className="fetch-button">
            {loading ? '読み込み中...' : '多摩センター行き'}
          </button>
        </div>
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
