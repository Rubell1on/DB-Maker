import React from 'react';
import './App.css'
import Editor from "./views/Editor/Editor";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainMenu from "./views/MainMenu/MainMenu";

function App() {
  return (
    <div className="app">
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MainMenu />}/>
                <Route path='/editor' element={<Editor />} />
            </Routes>
        </BrowserRouter>

    </div>
  );
}

export default App;
