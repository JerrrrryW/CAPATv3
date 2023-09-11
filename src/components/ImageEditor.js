import React, { Component } from 'react';

class ImageEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: null,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
      doubleClickZoom: 2,
    };
    this.imageRef = React.createRef();
  }

  handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ imageSrc: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  handleDoubleClick = () => {
    const { zoom, doubleClickZoom } = this.state;
  
    // 如果当前缩放级别小于双击放大级别，则进行放大，否则恢复原始缩放级别
    const newZoom = zoom < doubleClickZoom ? doubleClickZoom : 1;
  
    this.setState({ zoom: newZoom });
  };

  handleImageLoad = () => {
    const { naturalWidth, naturalHeight } = this.imageRef.current;
    const { clientWidth, clientHeight } = this.imageContainer;
  
    // Calculate initial zoom to fit the image's height inside the container
    const initialZoom = clientHeight / naturalHeight;
  
    this.setState({
      zoom: initialZoom,
      offsetX: 0,
      offsetY: 0,
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

  render() {
    const { imageSrc, zoom, offsetX, offsetY , imageWidth, imageHeight} = this.state;

    return (
      <div>
        <input type="file" accept="image/*" onChange={this.handleImageChange} />
        <div
          ref={(ref) => (this.imageContainer = ref)}
          onWheel={this.handleZoom}
          onMouseDown={this.handleDragStart}
          onMouseUp={this.handleDragEnd}
          onMouseLeave={this.handleDragEnd}
          onMouseMove={this.handleDrag}
          onDoubleClick={this.handleDoubleClick}
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {imageSrc && (
            <img
              ref={this.imageRef}
              src={imageSrc}
              onLoad={this.handleImageLoad}
              alt="Selected"
              style={{
                width: imageWidth,
                height: imageHeight,
                transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
                transition: 'transform 0.2s ease-in-out',
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default ImageEditor;
