import React from 'react';
import './App.css';

function App() {
  const handleClick1 = () => {
    alert('たませんた～');
  };
  const handleClick2 = () => {
    alert('たちかわ～');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>aws</h1>
        <p>web</p>
        <a onClick={handleClick1}>多摩センター行き</a>
        <b onClick={handleClick2}>上北台行き</b>
      </header>
    </div>
  );
}

export default App;
