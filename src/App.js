import React, { useState } from 'react';
import Cropper from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function ImageProcessing() {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({ aspect: 16 / 9 });

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onSelectFile} />
      {src && (
        <div>
          <h2>图像预览</h2>
          <img src={src} alt="预览图像" style={{ maxWidth: '100%' }} />
          <h2>图像裁剪</h2>
          <Cropper
            src={src}
            crop={crop}
            onChange={onCropChange}
            onComplete={(cropedImage) => {
              console.log(cropedImage);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageProcessing;
