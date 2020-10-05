import React from 'react';
import 'fontsource-roboto';
import { NavLink, Switch, Route } from 'react-router-dom';
import './App.css';
import Router from './Router';



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router />
      </header>
    </div>
  );
}

export default App;
