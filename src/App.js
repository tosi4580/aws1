import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify } from 'aws-amplify'; 
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
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

  const fetchTimetable = async (direction) => {
    setLoading(true);
    try {
      const apiUrl = `https://xy2igd6s8k.execute-api.ap-northeast-1.amazonaws.com/prod/timetable`; 
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (direction === 'northbound') {
        setFirstNorthboundTime(data.firstNorthboundTime || "データなし");
      } else if (direction === 'southbound') {
        setFirstSouthboundTime(data.firstSouthboundTime || "データなし");
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
        <div>最初の北行き電車の時間: {firstNorthboundTime}</div>
        <div>最初の南行き電車の時間: {firstSouthboundTime}</div>
        <div className="button-container">
          <button onClick={() => fetchTimetable('northbound')} disabled={loading} className="fetch-button">
            {loading ? '読み込み中...' : '北行きの時間を取得'}
          </button>
          <button onClick={() => fetchTimetable('southbound')} disabled={loading} className="fetch-button">
            {loading ? '読み込み中...' : '南行きの時間を取得'}
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
