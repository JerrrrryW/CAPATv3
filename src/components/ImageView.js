// src/components/ImageWindow.js
import React from 'react';
import './ImageView.css';
import ImageEditor from './ImageEditor';

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


function ImageView() {
  const images = [
    '/fragments/fragment1.png',
    '/fragments/fragment1.png',
    '/fragments/fragment1.png',
    '/fragments/fragment1.png',
    '/fragments/fragment1.png',
    '/fragments/fragment1.png'
    // 添加更多图像URL
  ];
  return (
    <div className="image-window">
      <div className='image-view'>
        <h2>图像窗口</h2>
        <ImageEditor />

      </div>
      <HistoryCard images={images}/>
    </div>
  );
}

export default ImageView;
