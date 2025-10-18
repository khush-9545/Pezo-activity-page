import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf"; // legacy build  
import "./PlaceOrder.css";

// Use CDN worker (no local import needed)
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

const PlaceOrder = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [processedPages, setProcessedPages] = useState([]); 
  const [pagesInput, setPagesInput] = useState(""); 
  const [colorType, setColorType] = useState("Color");
  const [invalidPages, setInvalidPages] = useState([]);
              //   const [validPages, setValidPages] = useState([]); // array of valid pages
              // const [isPlaceOrderEnabled, setIsPlaceOrderEnabled] = useState(false); // for button enable/disable
const [orders, setOrders] = useState([]); // stores all orders temporarily
const [selectAllPages, setSelectAllPages] = useState(false); // new state for full PDF selection





  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // single file
    setFile(selectedFile); // store file
    renderPDF(selectedFile); // render pages
  };

  // Handle drag-drop
  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0]; // single file
    setFile(selectedFile);
    renderPDF(selectedFile);
  };

  const handleDragOver = (e) => e.preventDefault();

  // Render PDF to canvas → images
  const renderPDF = async (pdfFile) => { // pdfFile is a File object
    const reader = new FileReader();// read file
    reader.onload = async () => { // on load
      const typedArray = new Uint8Array(reader.result); // convert to typed array
      const pdf = await pdfjsLib.getDocument(typedArray).promise; // load PDF
      // Render each page
      const pageImages = [];

      for (let i = 1; i <= pdf.numPages; i++) { // pages are 1-indexed the array starts from 0 and user will input 1-indexed pages
        const page = await pdf.getPage(i);  // get page
        const viewport = page.getViewport({ scale: 1.5 });  // scale for better quality
        const canvas = document.createElement("canvas");  
        const ctx = canvas.getContext("2d");  
        canvas.width = viewport.width;  
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise; // render to canvas
        pageImages.push(canvas.toDataURL());  // store image data URL
      }

      setPages(pageImages); 
    };    
    reader.readAsArrayBuffer(pdfFile);  // read as array buffer
  };

  // Convert image to B&W if selected
  const processImage = (dataUrl) => {
    if (colorType === "Color") return Promise.resolve(dataUrl); // no processing needed

    return new Promise((resolve) => {   // convert to B&W
      const img = new Image();
      img.src = dataUrl;
      const canvas = document.createElement("canvas");  
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0); // draw image

        // Get pixel data

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height); // get pixel data
        const data = imgData.data; // RGBA array

        // Convert to grayscale

        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
          data[i] = data[i + 1] = data[i + 2] = gray; 
        }

        ctx.putImageData(imgData, 0, 0); // update canvas
        resolve(canvas.toDataURL());  // return new data URL
      };
    });
  };

  // Update processed pages whenever pages or colorType changes
  useEffect(() => { // process images based on colorType
    if (pages.length === 0) return; 

    const updateProcessedPages = async () => {   // process all pages
      const newPages = [];  // store processed pages
      for (let p of pages) newPages.push(await processImage(p));  
      setProcessedPages(newPages);// update state
    };  
    
    updateProcessedPages(); // call async function
  }, [pages, colorType]); // re-run when pages or colorType changes
  // Parses input like "1-3,5,7" into an array of zero-indexed page numbers
const parsePagesInput = (input, totalPages) => {
  if (!input) return Array.from({ length: totalPages }, (_, i) => i); // all pages if empty

  const pagesSet = new Set(); // use set to avoid duplicates

  input.split(",").forEach((part) => { // split by comma and below 2 this the range
    if (part.includes("-")) { 
      const [start, end] = part.split("-").map(Number); 
      for (let i = start; i <= end; i++) pagesSet.add(i - 1); // zero-indexed
    } else {
      pagesSet.add(Number(part) - 1); 
    } 
  }); 

  // Filter invalid pages
  return Array.from(pagesSet) // convert to array
    .filter((i) => i >= 0 && i < totalPages)  
    .sort((a, b) => a - b); 
};
// Find invalid page numbers entered by user
const findInvalidPages = (input, totalPages) => {
  if (!input) return [];

  const invalid = [];
  input.split(",").forEach((part) => {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      for (let i = start; i <= end; i++) {
        if (i > totalPages || i < 1) invalid.push(i);
      }
    } else {
      const num = Number(part);
      if (num > totalPages || num < 1) invalid.push(num);
    }
  });

  return invalid;
};
// Handle changes in the pages input field
const handleInputChange = (e) => { 
  const text = e.currentTarget.textContent; // get user-typed text
  setPagesInput(text);

  const { valid, invalid } = parsePagesContent(text, processedPages.length);
  setValidPages(valid);
  setInvalidPages(invalid);
  setIsPlaceOrderEnabled(valid.length > 0 && invalid.length === 0); // enable only if all valid
};


// Parse input and return valid and invalid pages
const parsePagesContent = (input, totalPages) => {
  const valid = [];
  const invalid = [];

  if (!input) return { valid: [], invalid: [] };

  input.split(",").forEach((part) => {
    part = part.trim();
    if (!part) return;

    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      for (let i = start; i <= end; i++) {
        if (i >= 1 && i <= totalPages) valid.push(i);
        else invalid.push(i);
      }
    } else {
      const num = Number(part);
      if (num >= 1 && num <= totalPages) valid.push(num);
      else invalid.push(num);
    }
  });

  return { valid, invalid };
};

// Render input with invalid pages highlighted in red
const renderHighlightedInput = (input, totalPages) => {
  if (!input) return "";

  return input
    .split(/([-,])/)
    .map((token) => {
      if (/^\d+$/.test(token)) {
        const num = Number(token);
        const isInvalid = num < 1 || num > totalPages;
        return `<span style="color:${isInvalid ? "red" : "black"}">${token}</span>`;
      } else {
        return token; // keep separators as black
      }
    })
    .join("");
};


// Handle Place Order button click sending data to backend in JSON including valid pages, color type, and file name in array
// responsible for sending order data to backend or updating state and also all the logic in the place order button
const handlePlaceOrder = () => {
  if (!file) {
    alert("Please select a PDF file!");
    return;
  }

  // If checkbox is ticked, send all pages
  const selectedPages = selectAllPages
    ? Array.from({ length: processedPages.length }, (_, i) => i + 1) // all pages 1-indexed
    : parsePagesInput(pagesInput, processedPages.length).map((i) => i + 1); // selected pages

  if (selectedPages.length === 0) {
    alert("No valid pages selected!");
    return;
  }

  const orderData = {
    fileName: file.name,
    colorType,
    pages: selectedPages, // this array will always contain pages to send
    timestamp: new Date().toISOString(),
  };

  // Send to backend or update state
  setOrders((prev) => [...prev, orderData]);

  console.log("Order sent to backend:", orderData);

  // Reset UI
  setPagesInput("");
  setInvalidPages([]);
  setFile(null);
  setPages([]);
  setProcessedPages([]);
  setSelectAllPages(false);
};








  return (
    <div className="placeorder-page"> 
      {/* Header */}
      <header className="header">
        <div className="logo">PEZO</div>
        <nav className="nav">
          <a href="#">Home</a>
          <a href="#">Catalog</a>
          <button className="login-btn">Log In</button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="main">
        {/* Left Section - PDF Upload + Preview toward the printing */}
        <div className="upload-box" onDrop={handleDrop} onDragOver={handleDragOver}> {/* drag-drop area */}
          <h2>Upload Your PDF</h2>
          <div
  className="upload-area"
  onDrop={handleDrop}
  onDragOver={handleDragOver}
>
  {processedPages.length === 0 ? (
    <>
      <div className="upload-icon">📤</div>
      <p>Drag and drop your PDF here</p>

      <label className="file-btn">
        Choose a File
        <input type="file" accept=".pdf" onChange={handleFileChange} hidden />
      </label>

      {file && <p className="filename">{file.name}</p>}
    </>
  ) : (
    <>
      <div className="pdf-preview">
        {processedPages
          .filter((_, idx) =>
            parsePagesInput(pagesInput, processedPages.length).includes(idx)
          )
          .map((src, idx) => (
            <img key={idx} src={src} alt={`Page ${idx + 1}`} />
          ))}
      </div>

      {/* 🆕 Add this Clear button here */}
      <button
        className="clear-btn"
        onClick={() => {
          setFile(null);
          setPages([]);
          setProcessedPages([]);
        }}
      >
        Remove PDF
      </button>
    </>
  )}
</div>



          
        </div>

        {/* Right Section - Options + Summary */}
        <div className="summary-card">
          <h3>Print Options</h3>
          {/* {the pages turning number red} */}
<label>Number of Pages</label>

{/* Checkbox for selecting all pages */}
<label className="full-page-checkbox">
  <input
    type="checkbox"
    checked={selectAllPages}
    onChange={(e) => setSelectAllPages(e.target.checked)}
  />
  Select Full PDF
</label>

<div className="page-input-wrapper">
  {!selectAllPages && (
    <>
      {/* Highlight Layer */}
      <div className="page-input-highlight">
        {/* Your existing number-highlighting logic here */}
        {(() => {
          if (!pagesInput) return <span className="placeholder-text">e.g. 1-5,7,9</span>;
          const tokens = pagesInput.match(/\d+|[^0-9]+/g) || [];
          return tokens.map((token, idx) => {
            if (/^\d+$/.test(token)) {
              const num = Number(token);
              const isInvalid = num > processedPages.length || num < 1;
              return (
                <span key={idx} style={{ color: isInvalid ? "red" : "black", fontWeight: isInvalid ? "600" : "normal" }}>
                  {token}
                </span>
              );
            } else {
              return <span key={idx} style={{ color: "black" }}>{token}</span>;
            }
          });
        })()}
      </div>

      {/* Transparent Input Layer */}
      <input
        type="text"
        className="page-input-overlay"
        placeholder="e.g. 1-5,7,9"
        value={pagesInput}
        onChange={(e) => {
          const value = e.target.value;
          setPagesInput(value);
          setInvalidPages(findInvalidPages(value, processedPages.length));
        }}
        disabled={selectAllPages} // disables input if full page selected
      />
    </>
  )}
</div>

{/* <label className="full-page-checkbox">
  <input
    type="checkbox"
    checked={selectAllPages}
    onChange={(e) => setSelectAllPages(e.target.checked)}
  />
  Select Full PDF
</label> */}





{/* {pagesInput && ( // show only if there's input
  <div className="page-validation"> 
    {pagesInput.split(",").map((part, idx) => { // split by comma
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        const rangeDisplay = []; // display range
        for (let i = start; i <= end; i++) {
          const isInvalid = invalidPages.includes(i); // check if invalid
          rangeDisplay.push(
            <span 
              key={`${part}-${i}`}// unique key
              style={{ color: isInvalid ? "red" : "black", marginRight: 4 }}
            >
              {i}
            </span>
          );
        }
        return <span key={idx}>{rangeDisplay}</span>;
      } else {
        const num = Number(part);
        const isInvalid = invalidPages.includes(num);
        return (
          <span
            key={idx}
            style={{ color: isInvalid ? "red" : "black", marginRight: 4 }}
          >
            {num}
          </span>
        );
      }
    })}
  </div>
)} */}



          <div className="color-buttons">
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

          <div className="divider" />

          <h3>Order Summary</h3>
          <div className="summary-details">
            <p>
              <span>Total Pages</span>
              <span>{processedPages.length}</span>
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

          <button className="selectshop-btn">Select Shop</button> {/* non-functional */}
          <button
  className="placeorder-btn" 
  disabled={!file || (!selectAllPages && (invalidPages.length > 0 || pagesInput.trim() === ""))}
  onClick={handlePlaceOrder}
>
  Place Order
</button> {/* disabled if no file or invalid pages */}


        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
