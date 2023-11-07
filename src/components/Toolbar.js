// src/components/Toolbar.js
import React from 'react';
import './Toolbar.css';

function Toolbar({
  setImageSrc
}) {

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result); // Update the image state with the selected image
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="toolbar">
      <div id="toolbar-left">
        <a className="file">选择文件
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </a>
      </div>
      <div id="toolbar-center">
        中国传统绘画计算机辅助鉴别系统
      </div>
      <div id="toolbar-right">

      </div>

    </div>
  );
}

export default Toolbar;
