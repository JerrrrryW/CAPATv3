// src/App.js
import React from 'react';
import './App.css';
import Toolbar from './components/Toolbar.js';
import ImageView from './components/ImageView.js';
import AlgorithmList from './components/ToolsView.js';
import ImageUploader from './components/uploadImage';


function App() {
  return (
    <div className="app-container">
      <Toolbar />
      <div className="main-content">
        {/* <ImageUploader /> */}
        <ImageView />
        <AlgorithmList />
      </div>
    </div>
  );
}


export default App;
