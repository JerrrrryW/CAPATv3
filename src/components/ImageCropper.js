import React, { useState, useEffect, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';

/**
*file 版面文件
*useOcr true:通过OCR转换成文字；false:转换为图片
*onTransform 转换成文字或图片后调用组件外部方法
*/
export default function ({
  file,
  parentHeight = 600,
  setHistoricalImages,
  contentRef,
}) {
  const { url } = file;
  const [originImg, setOriginImg] = useState(); // 源图片
  const [contentNode, setContentNode] = useState(); // 最外层节点
  const [canvasNode, setCanvasNode] = useState(); // canvas节点
  const [btnGroupNode, setBtnGroupNode] = useState(); // 按钮组
  const [startCoordinate, setStartCoordinate] = useState([0, 0]); // 开始坐标
  const [dragging, setDragging] = useState(false); // 是否可以裁剪
  const [curPoisition, setCurPoisition] = useState(null); // 当前裁剪框坐标信息
  const [trimPositionMap, setTrimPositionMap] = useState([]); // 裁剪框坐标信息
  // const fileSyncUpdating = useSelector(state => state.loading.effects['digital/postImgFileWithAliOcr']);
  // const dispatch = useDispatch();
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [imgOffset, setImgOffset] = useState([0, 0]);
  const [imgScale, setImgScale] = useState([10, 10]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  // 初始化
  const initCanvas = () => {
    // url为上传的图片链接
    if (url == null) {
      return;
    }
    // contentNode为最外层DOM节点
    if (contentNode == null) {
      return;
    }
    // canvasNode为canvas节点
    if (canvasNode == null) {
      return;
    }

    const image = new Image();
    setOriginImg(image); // 保存源图
    image.addEventListener('load', () => {
      const ctx = canvasNode.getContext('2d');

      // 若源图宽度大于最外层节点的clientWidth，则设置canvas宽为clientWidth，否则设置为图片的宽度
      // const clientW = contentNode.clientWidth;
      // const size = image.width / clientW;
      // // 设置最大高度，比如500像素
      // const maxHeight = parentHeight;

      // let canvasWidth, canvasHeight;

      // if (image.width > clientW) {
      //   canvasWidth = clientW;
      //   canvasHeight = image.height / size;

      //   // 如果高度超过最大高度，重新计算宽度和高度
      //   if (canvasHeight > maxHeight) {
      //     const ratio = maxHeight / canvasHeight;
      //     canvasHeight = maxHeight;
      //     canvasWidth *= ratio;
      //   }
      // } else {
      //   canvasWidth = image.width;
      //   canvasHeight = image.height;

      //   // 如果高度超过最大高度，重新计算宽度和高度
      //   if (canvasHeight > maxHeight) {
      //     const ratio = maxHeight / canvasHeight;
      //     canvasHeight = maxHeight;
      //     canvasWidth *= ratio;
      //   }
      // }

      // canvasNode.width = canvasWidth;
      // canvasNode.height = canvasHeight;

      canvasNode.width = contentNode.clientWidth;
      canvasNode.height = parentHeight;

      // 计算图片放置在canvas中央时的位置
      const canvasWidth = canvasNode.width;
      const canvasHeight = canvasNode.height;
      const imageWidth = image.width;
      const imageHeight = image.height;
      let imgX = 0;
      let imgY = 0;

      // 计算图片放置的位置，使其居中
      if (imageWidth > imageHeight) {
        // 图片宽度大于高度
        const scaledHeight = (canvasWidth / imageWidth) * imageHeight;
        imgY = (canvasHeight - scaledHeight) / 2;
      } else {
        // 图片高度大于宽度
        const scaledWidth = (canvasHeight / imageHeight) * imageWidth;
        imgX = (canvasWidth - scaledWidth) / 2;
      }

      // 清空canvas
      ctx.clearRect(0, 0, canvasNode.width, canvasNode.height);

      // 绘制图片到canvas中央
      const scaledX = canvasNode.width - 2 * imgX;
      const scaledY = canvasNode.height - 2 * imgY;
      ctx.drawImage(image, imgX, imgY, scaledX, scaledY);
      setImgOffset([imgX, imgY]);
      setImgScale([scaledX, scaledY]);

    });
    // image.crossOrigin = 'anonymous'; // 解决图片跨域问题
    image.src = url;
  };

  // 点击鼠标事件
  const handleMouseDownEvent = e => {
    // 开始裁剪
    setDragging(true);
    setTrimPositionMap([]);
    const { offsetX, offsetY } = e.nativeEvent;
    // 保存开始坐标
    setStartCoordinate([offsetX, offsetY]);

    if (btnGroupNode == null) {
      return;
    }
    // 裁剪按钮不可见
    // btnGroupNode.style.display = 'none';
  };

  // 移动鼠标事件
  const handleMouseMoveEvent = e => {
    if (!dragging) {
      const { offsetX, offsetY } = e.nativeEvent;
      setMousePosition({ x: offsetX, y: offsetY });
      return;
    }
    const ctx = canvasNode.getContext('2d');
    // 每一帧都需要清除画布(取最后一帧绘图状态, 否则状态会累加)
    ctx.clearRect(0, 0, canvasNode.width, canvasNode.height);

    const { offsetX, offsetY } = e.nativeEvent;
    setMousePosition({ x: offsetX, y: offsetY });

    // 计算临时裁剪框的宽高
    const tempWidth = offsetX - startCoordinate[0];
    const tempHeight = offsetY - startCoordinate[1];
    // 调用绘制裁剪框的方法
    drawTrim(startCoordinate[0], startCoordinate[1], tempWidth, tempHeight);
  };

  // 松开鼠标
  const handleMouseRemoveEvent = () => {
    // 结束裁剪
    setDragging(false);

    // 处理裁剪按钮样式
    if (curPoisition == null) {
      return;
    }
    if (btnGroupNode == null) {
      return;
    }
    btnGroupNode.style.display = 'block';
    btnGroupNode.style.left = `${curPoisition.startX}px`;
    btnGroupNode.style.top = `${curPoisition.startY + curPoisition.height}px`;

    setTrimPositionMap([curPoisition]);
    console.log(curPoisition);
    console.log(imgOffset)

    // 判断裁剪区是否重叠(此项目需要裁剪不规则的相邻区域，所以裁剪框重叠时才支持批量裁剪)
    // judgeTrimAreaIsOverlap();
  };

  // 设置鼠标滚动事件
  // 监听滚动事件
  const handleScroll = (event) => {
    event.preventDefault();
    const delta = event.deltaY;
    let newZoomLevel = zoomLevel + (delta > 0 ? -0.1 : 0.1);

    // 限制缩放范围
    newZoomLevel = Math.max(0.1, Math.min(3.0, newZoomLevel));

    setZoomLevel(newZoomLevel);
  };

  useEffect(() => {
    initCanvas();
    // 添加滚动事件监听
    if (canvasNode) {
      canvasNode.addEventListener('wheel', handleScroll);
    }

    return () => {
      // 移除滚动事件监听
      if (canvasNode) {
        canvasNode.removeEventListener('wheel', handleScroll);
      }
    };
  }, [canvasNode, url]);

  useEffect(() => {

    if (canvasNode && originImg) {
      const ctx = canvasNode.getContext('2d');
      // 清除画布
      ctx.clearRect(0, 0, canvasNode.width, canvasNode.height);
  
      // 计算鼠标相对于canvas的位置
      const canvasRect = canvasNode.getBoundingClientRect();
      const mouseX = mousePosition.x - canvasRect.left;
      const mouseY = mousePosition.y - canvasRect.top;
  
      // 缩放画布以鼠标位置为中心
      ctx.save();
      ctx.translate(mouseX, mouseY);
      ctx.scale(zoomLevel, zoomLevel);
      ctx.translate(-mouseX, -mouseY);
  
      // 绘制图像
      ctx.drawImage(originImg, imgOffset[0], imgOffset[1], imgScale[0], imgScale[1]);
      console.log(imgOffset)
      console.log(imgScale)
  
      ctx.restore();
    }
  
    // 添加滚动事件监听
    if (canvasNode) {
      canvasNode.addEventListener('wheel', handleScroll);
    }
  
    return () => {
      // 移除滚动事件监听
      if (canvasNode) {
        canvasNode.removeEventListener('wheel', handleScroll);
      }
    };
  }, [originImg, zoomLevel, canvasNode]);


  // 获得裁剪后的图片文件
  const getImgTrimData = () => {
    // trimPositionMap为裁剪框的坐标数据
    console.log(trimPositionMap);
    if (trimPositionMap.length === 0) {
      return;
    }

    const ctx = canvasNode.getContext('2d');
    const trimPadding = 5; // 裁剪框内边距

    // 重新构建一个canvas，计算出包含多个裁剪框的最小矩形
    const trimCanvasNode = document.createElement('canvas');
    const { startX, startY, minWidth, minHeight } = getMinTrimReactArea();
    trimCanvasNode.width = minWidth;
    trimCanvasNode.height = minHeight;
    const trimCtx = trimCanvasNode.getContext('2d');
    trimCtx.clearRect(0, 0, trimCanvasNode.width, trimCanvasNode.height);
    trimPositionMap.map(pos => {
      // 取到裁剪框的像素数据
      console.log("trim pos:", pos);
      const data = ctx.getImageData(pos.startX + trimPadding, pos.startY + trimPadding , pos.width - 2 * trimPadding, pos.height - 2 * trimPadding );
      // 输出在canvas上
      trimCtx.putImageData(data, pos.startX - startX, pos.startY - startY);
      ctx.clearRect(0, 0, canvasNode.width, canvasNode.height);
      setOriginImg(trimCanvasNode);
      // 刷新ctx
      ctx.putImageData(data, pos.startX + trimPadding, pos.startY + trimPadding);
      const dataUrl = trimCanvasNode.toDataURL();

      // 向父节点传递历史切片信息
      setHistoricalImages(prevState => [...prevState, dataUrl]);
      return null;
    });

    // 将裁剪后的图片显示在页面上（仅供测试使用）
    // contentNode.appendChild(trimCanvasNode);

    // const trimData = trimCanvasNode.toDataURL();
  };

  // 计算出包含多个裁剪框的最小矩形
  const getMinTrimReactArea = () => {
    const startX = Math.min(...trimPositionMap.map(item => item.startX));
    const endX = Math.max(...trimPositionMap.map(item => item.startX + item.width));
    const startY = Math.min(...trimPositionMap.map(item => item.startY));
    const endY = Math.max(...trimPositionMap.map(item => item.startY + item.height));
    return {
      startX,
      startY,
      minWidth: endX - startX,
      minHeight: endY - startY,
    };
  };

  // 绘制裁剪框的方法
  const drawTrim = (x, y, w, h, flag) => {
    const ctx = canvasNode.getContext('2d');

    // 绘制蒙层
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; // 蒙层颜色
    ctx.fillRect(0, 0, canvasNode.width, canvasNode.height);

    // 将蒙层凿开
    ctx.globalCompositeOperation = 'source-atop';
    // 裁剪选择框
    ctx.clearRect(x, y, w, h);
    if (!flag && trimPositionMap.length > 0) {
      trimPositionMap.map(item => ctx.clearRect(item.startX, item.startY, item.width, item.height));
    }

    // 绘制8个边框像素点
    ctx.globalCompositeOperation = 'source-over';
    drawBorderPixel(ctx, x, y, w, h);
    if (!flag && trimPositionMap.length > 0) {
      trimPositionMap.map(item => drawBorderPixel(ctx, item.startX, item.startY, item.width, item.height));
    }

    // 保存当前区域坐标信息
    setCurPoisition({
      width: w,
      height: h,
      startX: x,
      startY: y,
      position: [
        (x, y),
        (x + w, y),
        (x, y + h),
        (x + w, y + h),
        (x + w / 2, y),
        (x + w / 2, y + h),
        (x, y + h / 2),
        (x + w, y + h / 2),
      ],
      canvasWidth: canvasNode.width, // 用于计算移动端版面图缩放比例
    });

    ctx.restore();

    // 再次调用drawImage将图片绘制到蒙层下方
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage(originImg, imgOffset[0], imgOffset[1], imgScale[0], imgScale[1]);
    ctx.restore();
  };

  // 绘制边框像素点的方法  
  const drawBorderPixel = (ctx, x, y, w, h) => {
    ctx.fillStyle = '#f5222d';
    const size = 5; // 自定义像素点大小
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
    // ...同理通过ctx.fillRect再画出其余像素点
    ctx.fillRect(x + w - size / 2, y - size / 2, size, size);
    ctx.fillRect(x - size / 2, y + h - size / 2, size, size);
    ctx.fillRect(x + w - size / 2, y + h - size / 2, size, size);

    ctx.fillRect(x + w / 2 - size / 2, y - size / 2, size, size);
    ctx.fillRect(x + w / 2 - size / 2, y + h - size / 2, size, size);
    ctx.fillRect(x - size / 2, y + h / 2 - size / 2, size, size);
    ctx.fillRect(x + w - size / 2, y + h / 2 - size / 2, size, size);
  };

  return (
    <section ref={setContentNode} className="modaLLayout"  >
      <div ref={setBtnGroupNode} className="buttonWrap">
        <button
          type="link"
          icon="close"
          size="small"
          ghost
        // disabled={fileSyncUpdating} 
        >
          取消
        </button>
        <button
          type="link"
          icon="file-image"
          size="small"
          ghost
          // disabled={fileSyncUpdating}
          onClick={getImgTrimData}
        >
          转为图片
        </button>
        {/* <button
          type="link"
          icon="file-text"
          size="small"
          ghost
          // loading={fileSyncUpdating}
          onClick={getImgTrimData}
        >
          转为文字
        </button> */}
      </div>
      <canvas
        ref={setCanvasNode}
        onMouseDown={handleMouseDownEvent}
        onMouseMove={handleMouseMoveEvent}
        onMouseUp={handleMouseRemoveEvent}
      />

    </section>
  )
}
