import React from 'react';
import './App.css'
import {BrowserRouter} from "react-router-dom";
import AppRouter from './routers/AppRouter';
import './fonts/Rubik-Regular.ttf'

function App() {

  return (
    <div className="app">
      <BrowserRouter>
        <AppRouter/>
      </BrowserRouter>

    </div>
  );
}

export default App;
