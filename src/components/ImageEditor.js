import React, { Component } from 'react';
import ImageCrop from './ImageCrop'; // 根据文件路径调整

class ImageEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: null,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    };
    this.imageRef = React.createRef();
  }

  handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ imageSrc: e.target.result });
        console.log(this.imageSrc)
      };
      reader.readAsDataURL(file);
      this.handleUploadImg(file);
    }

  };

  handleUploadImg = (file) => {
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

  handleImageLoad = () => {
    const { naturalWidth, naturalHeight } = this.imageRef.current;
    const { clientHeight } = this.imageContainer;
    console.log(clientHeight);
    // Calculate the aspect ratio of the image
    const aspectRatio = naturalWidth / naturalHeight;
  
    // Calculate the new width and height to fit the container while preserving the aspect ratio
    const newHeight = clientHeight;
    const newWidth = newHeight * aspectRatio;//clientWidth;
  
    // Set the state to update the image dimensions
    this.setState({
      imageWidth: newWidth,
      imageHeight: newHeight,
    });
  };  

  handleZoom = (event) => {
    const { zoom } = this.state;
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = zoom * zoomFactor;

    this.setState({ zoom: newZoom });
  };

  handleDragStart = (event) => {
    event.preventDefault();
    this.dragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
  };

  handleDragEnd = () => {
    this.dragging = false;
  };

  handleDrag = (event) => {
    if (this.dragging) {
      const { offsetX, offsetY } = this.state;
      const { clientX, clientY } = event;

      const deltaX = clientX - this.startX;
      const deltaY = clientY - this.startY;

      this.setState({
        offsetX: offsetX + deltaX,
        offsetY: offsetY + deltaY,
      });

      this.startX = clientX;
      this.startY = clientY;
    }
  };
  // const [crop, setCrop] = useState({ x: 0, y: 0 });
  // const [zoom, setZoom] = useState(1);

  // onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
  //   console.log(croppedArea, croppedAreaPixels);
  // }, []);

  render() {
    const { imageSrc, zoom, offsetX, offsetY , imageWidth, imageHeight} = this.state;
    // console.log(imageSrc)
    return (
      <div
      style={{
        maxWidth: '100%',
        maxHeight:'100%',
        overflow: 'hidden',
      }}>
        <input type="file" accept="image/*" onChange={this.handleImageChange} />
        <div
          ref={(ref) => (this.imageContainer = ref)}
          onWheel={this.handleZoom}
          onMouseDown={this.handleDragStart}
          onMouseUp={this.handleDragEnd}
          onMouseLeave={this.handleDragEnd}
          onMouseMove={this.handleDrag}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {imageSrc && (
             <ImageCrop
             imageSrc={imageSrc}
             zoom={zoom}
             offsetX={offsetX}
             offsetY={offsetY}
             imageWidth={imageWidth}
             imageHeight={imageHeight}
             onImageLoad={this.handleImageLoad}
           />
          )}
        </div>
      </div>
    );
  }
}

export default ImageEditor;

