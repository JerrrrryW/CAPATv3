import React, { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './getCroppedImg'; // 请根据需求创建一个函数来生成裁剪后的图像

const ImageCrop = ({ imageSrc }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0, width:200, height:150});
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropComplete, setCropComplete] = useState(false);
  const cropContainerRef = useRef(null);

  const onCropChange = (newCrop) => {
    setCrop(newCrop);
    setCropComplete(false);
  };

  const onZoomChange = (newZoom) => {
    setZoom(newZoom);
    setCropComplete(false);
  };

  const onCropComplete = () => {
    setCropComplete(true);
  };

  const handleDownload = async () => {
    const croppedImageUrl = await getCroppedImg(imageSrc, crop);
    setCroppedImage(croppedImageUrl);
  };

  return (
    <div>
      <h2>图像剪切</h2>
      <div style={{ position: 'relative', width: '100%', height: 400 }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3} // 设置裁剪区域的宽高比例
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
          cropSize={{ width: 200, height: 150 }} // 设置裁剪后图像的大小
          containerStyle={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        />
      </div>
      <button onClick={handleDownload} disabled={!cropComplete}>
        裁剪图像
      </button>
      {croppedImage && (
        <div>
          <h3>裁剪结果</h3>
          <img src={croppedImage} alt="Cropped" />
        </div>
      )}
    </div>
  );
};

export default ImageCrop;
