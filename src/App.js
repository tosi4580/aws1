import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify, Auth, API } from 'aws-amplify'; 
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
  const [northboundTimetable, setNorthboundTimetable] = useState([]);
  const [southboundTimetable, setSouthboundTimetable] = useState([]);
  const [loading, setLoading] = useState(false); // ローディング状態を追加
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString()); // 現在の時刻を保存
  const [trainDepartureTime, setTrainDepartureTime] = useState(""); // 次の電車の時刻を保存
  const [trainDepartureMinus10, setTrainDepartureMinus10] = useState(""); // 次の電車の時刻-10分を保存

  // 現在時刻を更新するためのエフェクト
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000); // 1秒ごとに現在時刻を更新
    return () => clearInterval(intervalId);
  }, []);

  const fetchTimetable = async (direction) => {
    setLoading(true); // ローディング状態を設定
    try {
      const now = new Date();
      const nowPlus10 = new Date(now.getTime() + 10 * 60000); // 現在の時刻に10分追加
      const timeString = now.toTimeString().substr(0, 5); 
      const apiUrl = `https://xy2igd6s8k.execute-api.ap-northeast-1.amazonaws.com/prod/TimeTable?time=${timeString}`;

      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (direction === 'Northbound') {
        const northbound = data.filter(item => item.railDirection === 'Northbound');
        setNorthboundTimetable(northbound);
        if (northbound.length > 0) {
          const departureTime = new Date(now.getTime() + 10 * 60000).toLocaleTimeString();
          const departureMinus10 = new Date(now.getTime()).toLocaleTimeString();
          setTrainDepartureTime(departureTime);
          setTrainDepartureMinus10(departureMinus10);
        }
      } else {
        const southbound = data.filter(item => item.railDirection === 'Southbound');
        setSouthboundTimetable(southbound);
        if (southbound.length > 0) {
          const departureTime = new Date(now.getTime() + 10 * 60000).toLocaleTimeString();
          const departureMinus10 = new Date(now.getTime()).toLocaleTimeString();
          setTrainDepartureTime(departureTime);
          setTrain
        }
      }
    }
  }
}
