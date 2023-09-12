// 引入 html-to-image 库
import htmlToImage from 'html-to-image';

async function getCroppedImg(imageSrc, crop) {
  const image = new Image();
  image.src = imageSrc;

  // 计算图像的实际大小
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // 计算裁剪区域的实际大小和位置
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = crop.width;
  canvas.height = crop.height;
  console.log(canvas.width, canvas.height); // 检查 Canvas 大小
  console.log(crop)
  try {
    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        200 * scaleX,
        150 * scaleY,
        0,
        0,
        200,
        150
      );
  } catch (error) {
    console.error('剪切图像时出错：', error);
  }
  
  // 将裁剪后的图像保存为 Data URL
  const croppedImageUrl = canvas.toDataURL('image/jpeg');
  console.log(croppedImageUrl)
  // 如果需要将裁剪后的图像保存为文件，可以使用以下代码：
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
  const croppedFile = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });

  return croppedImageUrl;
}

export default getCroppedImg;
