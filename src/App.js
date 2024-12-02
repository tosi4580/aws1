import React from 'react';
import './App.css';

function App() {
  const handleClick = () => {
    alert('Click!');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>aws</h1>
        <p>web</p>
        <a onClick={handleClick}>上り</a>
      </header>
    </div>
  );
}

export default App;
