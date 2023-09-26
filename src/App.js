// src/App.js
import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import './components/HistoryCard.css';
import Toolbar from './components/Toolbar.js';
import AlgorithmList from './components/ToolsView.js';
import ImageCropper from './components/ImageCropper.js';

function HistoryCard({ images }) {
  return (
    <div className="card" >
      <div className="card-header">切片历史</div>
      <div className="image-list">
        <div className="scrollable-images">
          {images.map((image, index) => (
            <img src={image} alt={`Image ${index}`} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}



function App() {
  const historicalImages = [
    '/fragments/P330_1.png',
    '/fragments/P330_2.png',
    '/fragments/P330_3.png',
    '/fragments/P330_4.png',
    '/fragments/P330_5.png',
    '/fragments/P330_6.jpeg',
  ]
  const [imageSrc, setImageSrc] = useState('./P330.jpg');
  const cropperParentRef = useRef(null);

  return (
    <div className="app-container">
      <Toolbar 
        setImageSrc={setImageSrc}
      />
      <div className="main-content">
        {/* <ImageUploader /> */}
        <div className='left-panel'>
          <div id='image-container' ref={cropperParentRef}>
            <ImageCropper file={{ url: imageSrc }} />
          </div>
          <div id='history-container'>
            <HistoryCard images={historicalImages} />
          </div>
        </div>
        {/* <ImageCropper /> */}
        <AlgorithmList />
      </div>
    </div>
  );
}


export default App;
