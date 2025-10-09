import React, { useState } from "react";
import "./PlaceOrder.css";

const PlaceOrder = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState("");
  const [colorType, setColorType] = useState("Color");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="placeorder-page">
      {/* Header */}
      <header className="po-header">
        <div className="po-logo">PEZO</div>
        <nav className="po-nav">
          <a href="#">Home</a>
          <a href="#">Catalog</a>
          <button className="po-login-btn">Log In</button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="po-main">
        {/* Left Section - Upload PDF */}
        <div
          className="po-upload-box"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <h2>Upload Your PDF</h2>
          <div className="po-upload-area">
            <div className="po-upload-icon">📤</div>
            <p>Drag and drop your PDF here</p>
            <span>or</span>
            <label className="po-file-btn">
              Choose a File
              <input type="file" accept=".pdf" onChange={handleFileChange} hidden />
            </label>
            {file && <p className="po-filename">{file.name}</p>}
          </div>
        </div>

        {/* Right Section - Print Options + Summary */}
        <div className="po-summary-card">
          <h3>Print Options</h3>
          <label>Number of Pages</label>
          <input
            type="text"
            placeholder="e.g. 1-5,7,9"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
          />

          <div className="po-color-buttons">
            <button
              className={colorType === "Color" ? "active" : ""}
              onClick={() => setColorType("Color")}
            >
              Color
            </button>
            <button
              className={colorType === "Black & White" ? "active" : ""}
              onClick={() => setColorType("Black & White")}
            >
              Black & White
            </button>
          </div>

          <div className="po-divider" />

          <h3>Order Summary</h3>
          <div className="po-summary-details">
            <p>
              <span>Total Pages</span>
              <span>0</span>
            </p>
            <p>
              <span>Type</span>
              <span>{colorType}</span>
            </p>
            <p>
              <span>Price</span>
              <span>₹0.00</span>
            </p>
          </div>

          <button className="po-selectshop-btn">Select Shop</button>
          <button className="po-placeorder-btn">Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
