import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';

function App() {
  const [northboundTimetable, setNorthboundTimetable] = useState([]);
  const [southboundTimetable, setSouthboundTimetable] = useState([]);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const now = new Date();
      now.setHours(now.getHours() + 9); // JSTに変換するために9時間を加算
      now.setMinutes(now.getMinutes() + 10); // さらに10分を加算
      const timeString = now.toTimeString().substr(0, 5); // 時間をHH:MM形式に変換
      const apiUrl = `arn:aws:execute-api:ap-northeast-1:127214172620:xy2igd6s8k/*/*/myTT`; // ここにAPIのURLを入力

      // API.getの呼び出し部分
      const response = await fetch(apiurl);
      const data = await response.json();
      
      // 南行きと北行きに分けて設定
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
