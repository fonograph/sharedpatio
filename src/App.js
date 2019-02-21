import React, { Component } from 'react';
import logo from './img/sharedpatio.jpg';
import './css/style.css';
import Home from "./Home";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1><a href='/'><img src={logo} alt='Shared Patio' /></a></h1>
          <Home/>
        </header>
      </div>
    );
  }
}

export default App;
