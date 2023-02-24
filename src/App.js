import "./App.css";
import React, { useEffect, useRef, useState } from "react";
const App = () => {
  const [image, setImage] = useState("");
  const [showUploadedImage, setUploadedImage] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [isDrawRectangle, setIsDrawRectangle] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const canvasOffsetX = useRef(null);
  const canvasOffsetY = useRef(null);
  const startX = useRef(null);
  const startY = useRef(null);

  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [imgData, setImageData] = useState("");

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");

    context.strokeStyle = "red";
    context.lineCap = "round";
    context.lineWidth = 2;
    contextRef.current = context;

    const canvasOffset = canvasRef.current.getBoundingClientRect();

    // this well gave the position of the canvas
    canvasOffsetX.current = canvasOffset.top;
    canvasOffsetY.current = canvasOffset.left;
  }, []);

  const startDraw = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    nativeEvent.preventDefault();

    setOffsetX(offsetX + 5);
    setOffsetY(offsetY - 5);
    setIsDraw(true);
  };

  const startDrawRectangle = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;

    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();

    startX.current = offsetX - canvasOffsetX.current;
    startY.current = offsetY - canvasOffsetY.current;

    setOffsetX(offsetX + 5);
    setOffsetY(offsetY - 5);
    setIsDraw(true);
  };

  const drawRectangle = ({ nativeEvent }) => {
    if (!isDraw) {
      return;
    }

    const { offsetX, offsetY } = nativeEvent;

    const newX = offsetX - canvasOffsetX.current;
    const newY = offsetY - canvasOffsetY.current;
    const reactWidth = newX - startX.current;
    const reactHeight = newY - startY.current;

    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    contextRef.current.putImageData(imgData, 0, 0);

    contextRef.current.strokeRect(
      startX.current,
      startY.current,
      reactWidth,
      reactHeight
    );

    nativeEvent.preventDefault();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDraw) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    nativeEvent.preventDefault();
  };

  const stopDraw = () => {
    const context = canvasRef.current.getContext("2d");
    context.closePath();
    context.lineWidth = 0.5;
    context.strokeStyle = "red";
    // generate id for the draw
    let id = Math.floor(Math.random() * 1000);
    contextRef.current.strokeText(id, offsetX, offsetY);
    setIsDraw(false);
  };

  const downloadImage = (event) => {
    let link = event.currentTarget;
    link.setAttribute("download", "drawImage.png");
    let image = canvasRef.current.toDataURL("image/png");
    link.setAttribute("href", image);
  };

  function onchangeImage(event) {
    setImage(event.target.files[0]);
  }

  function onClickUpload() {
    let imageURL = URL.createObjectURL(image);

    var background = new Image();
    background.src = imageURL;

    background.onload = () => {
      contextRef.current.drawImage(
        background,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    };

    setUploadedImage(true);
  }

  return (
    <div className="App">
      <h1>Hi Welcome to draw Image</h1>
      <h5>Please upload image and then you can draw in it </h5>
      <div
        style={{
          backgroundColor: "GrayText",
          padding: "20px",
          borderRadius: "30px",
        }}
      >
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={onchangeImage}
        />
        <button type="submit" onClick={onClickUpload} className="submitButton">
          Upload Image
        </button>
        <div style={{ padding: "5px" }}>
          <p>Please Select how to want to draw :</p>
          <button
            type="submit"
            onClick={() => setIsDrawRectangle(false)}
            className="drawButton"
          >
            Free Drawing
          </button>
          <button
            type="submit"
            onClick={() => {
              let imageData = contextRef.current.getImageData(
                canvasOffsetX.current,
                canvasOffsetX.current,
                canvasRef.current.width,
                canvasRef.current.height
              );
              setImageData(imageData);
              setIsDrawRectangle(true);
            }}
            className="drawButton"
          >
            Draw Rectangle
          </button>
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={isDrawRectangle ? startDrawRectangle : startDraw}
          onMouseMove={isDrawRectangle ? drawRectangle : draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          hidden={!showUploadedImage}
          width="500"
          height="300"
        />

        {showUploadedImage && (
          <div>
            <a
              href="download_link"
              onClick={downloadImage}
              className="submitButton"
            >
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
