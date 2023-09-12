import React, { useState } from 'react';

function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    handleUpload(file)
  };

  const handleUpload = (file) => {
    const formData = new FormData();
    formData.append('image', file);

    fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log(data); // 处理来自Flask后端的响应
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
}

export default ImageUploader;
