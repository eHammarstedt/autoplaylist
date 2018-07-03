import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
            <h1>Autplaylist thing</h1>
            Login: <a href={"http://localhost:8080/login"}>here</a>
        </p>
      </div>
    );
  }
}

export default App;
