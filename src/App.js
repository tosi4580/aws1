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
      now.setHours(now.getHours() + 9); // JSTに変換するために9時間を加算
      now.setMinutes(now.getMinutes() + 10); // さらに10分を加算
      const timeString = now.toTimeString().substr(0, 5); // 時間をHH:MM形式に変換
      const apiUrl = `https://xy2igd6s8k.execute-api.ap-northeast-1.amazonaws.com/prod/TimeTable?time=${timeString}`; // ここにAPIのURLを入力

      // API.getの呼び出し部分
      const response = await fetch(apiUrl);
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
