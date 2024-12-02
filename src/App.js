import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>yokoyama</h1>
        <p>toshiki</p>
    <a class="my-up-button" href="#">上り</a>
    <b class="my-down-button" href="#">下り</b>
      </header>

    </div>
  );
}
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}


export default App;
