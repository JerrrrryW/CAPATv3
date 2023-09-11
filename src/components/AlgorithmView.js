import React, { useState, useEffect } from 'react';
import AttriCard from './AttriCard';

function AlgorithmView({ inputArray }) {
  const [buttonColumns, setButtonColumns] = useState(3); // 初始按钮列数为3
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const attris = [
    { name: "参数1", min: 0, max: 100 },
    { name: "参数2", min: 0, max: 50 },
    // 添加更多参数
  ];

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // 根据窗口宽度和输入数组长度自动调整按钮列数
    if (windowWidth < 768) {
      setButtonColumns(2); // 如果窗口宽度小于768px，切换为两列布局
    } else if (windowWidth >= 768 && windowWidth < 1024) {
      setButtonColumns(3); // 如果窗口宽度在768px和1024px之间，切换为三列布局
    } else {
      setButtonColumns(4); // 如果窗口宽度大于等于1024px，切换为四列布局
    }
  }, [windowWidth, inputArray.length]);

  return (
    <div>
      {/* 上方算法按钮列表 */}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {inputArray.map((item, index) => (
          <button
            key={index}
            style={{ flexBasis: `calc(${100 / buttonColumns}% - 10px)`, margin: '5px' }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* 中部图片处理结果预览区域 */}
      <div style={{ marginTop: '20px' , display: 'grid', placeItems: 'center', height: '300px'}}>
        {/* 添加图片处理结果预览区域的内容 */}
        <img src='/logo192.png' alt="Processed Image" />
      </div>

      {/* 下方参数调整窗口卡片 */}
      <div style={{ marginTop: '20px' }}>
        <AttriCard attris={attris} />
      </div>
    </div>
  );
}

export default AlgorithmView;
