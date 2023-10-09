import React, { useState, useEffect } from 'react';
import AttriCard from './AttriCard';
import './AlgorithmView.css';
import axios from 'axios';
function AlgorithmView({ 
  inputArray ,
  imgSrc,
}) {
  const [buttonColumns, setButtonColumns] = useState(3); // 初始按钮列数为3
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [highlightedButtonIndex, setHighlightedButtonIndex] = useState(null);

  const attris = [
    { name: "参数1", min: 0, max: 100 , value: 50},
    { name: "参数2", min: 0, max: 50 , value: 25},
    // 添加更多参数
  ];
  const getData = async() => {
    await axios.request("http://127.0.0.1:5000/getImgProceed/",{
		method:'get',
		responseType:'blob'
	  }).then((res)=>{
		let blob = new Blob([res.data], {type: "img/png"});
		let url = window.URL.createObjectURL(blob);
		let captchaImg = document.getElementById('captchaImg')
		if(captchaImg){
		  	// @ts-ignore
			// console.log(url)
		  	captchaImg.src = url
		  	captchaImg.onload = function () {
			URL.revokeObjectURL(url)
		  }
		}
		console.log(url)
		console.log(res)
	  }).catch (err=>{
		console.log(err)
	  })
};

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const handleButtonClick = (index) => {
    setHighlightedButtonIndex(index);
    //TODO 
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
    <div className='algorithm-container'>
      {/* 上方算法按钮列表 */}
      <div className='algorithm-buttons'>
        {inputArray.map((item, index) => (
          <button
            key={index}
            className={highlightedButtonIndex === index ? 'active' : ''}
            style={{
              flexBasis: `calc(${100 / buttonColumns}% - 10px)`,
              margin: '5px',
              // backgroundColor: highlightedButtonIndex === index ? 'yellow' : 'initial',
            }}
            onClick={() => handleButtonClick(index)}
          >
            {item}
          </button>
        ))}
      </div>
      {/* 中部图片处理结果预览区域 */}
      <div className='image-preview'>
        {/* 添加图片处理结果预览区域的内容 */}
        <img
          id = "captchaImg"
          src = {imgSrc}
          alt = '点击刷新'
          onClick={getData}
			  />
      </div>

      {/* 下方参数调整窗口卡片 */}
      <div className='attri-card'>
        <AttriCard attris={attris} />
      </div>
    </div>
  );
}

export default AlgorithmView;
