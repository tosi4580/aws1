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

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const apiUrl = `https://abcdefg123.execute-api.ap-northeast-1.amazonaws.com/prod/timetable`; // 
      const response = await fetch(apiUrl);
      const data = await response.json();

      setFirstNorthboundTime(data.firstNorthboundTime || "データなし");
      setFirstSouthboundTime(data.firstSouthboundTime || "データなし");
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
    </div>
  );
}

export default App;
