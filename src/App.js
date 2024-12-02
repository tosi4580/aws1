import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>yokoyama</h1>
        <p>toshiki</p>
    <a on Click={this.handleClick1}>上り</a>
      </header>
    </div>
  );

handleClick1() {
    alert('Click!')
  }
}
export default App;
