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

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    renderPDF(selectedFile);
  };

  // Handle drag-drop
  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    setFile(selectedFile);
    renderPDF(selectedFile);
  };

  const handleDragOver = (e) => e.preventDefault();

  // Render PDF to canvas → images
  const renderPDF = async (pdfFile) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      const pageImages = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;
        pageImages.push(canvas.toDataURL());
      }

      setPages(pageImages);
    };
    reader.readAsArrayBuffer(pdfFile);
  };

  // Convert image to B&W if selected
  const processImage = (dataUrl) => {
    if (colorType === "Color") return Promise.resolve(dataUrl);

    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
          data[i] = data[i + 1] = data[i + 2] = gray;
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL());
      };
    });
  };

  // Update processed pages whenever pages or colorType changes
  useEffect(() => {
    if (pages.length === 0) return;

    const updateProcessedPages = async () => {
      const newPages = [];
      for (let p of pages) newPages.push(await processImage(p));
      setProcessedPages(newPages);
    };

    updateProcessedPages();
  }, [pages, colorType]);
  // Parses input like "1-3,5,7" into an array of zero-indexed page numbers
const parsePagesInput = (input, totalPages) => {
  if (!input) return Array.from({ length: totalPages }, (_, i) => i); // all pages if empty

  const pagesSet = new Set();

  input.split(",").forEach((part) => {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      for (let i = start; i <= end; i++) pagesSet.add(i - 1); // zero-indexed
    } else {
      pagesSet.add(Number(part) - 1);
    }
  });

  // Filter invalid pages
  return Array.from(pagesSet)
    .filter((i) => i >= 0 && i < totalPages)
    .sort((a, b) => a - b);
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
        {/* Left Section - PDF Upload + Preview */}
        <div className="po-upload-box" onDrop={handleDrop} onDragOver={handleDragOver}>
          <h2>Upload Your PDF</h2>
          <div
  className="po-upload-area"
  onDrop={handleDrop}
  onDragOver={handleDragOver}
>
  {processedPages.length === 0 ? (
    <>
      <div className="po-upload-icon">📤</div>
      <p>Drag and drop your PDF here</p>

      <label className="po-file-btn">
        Choose a File
        <input type="file" accept=".pdf" onChange={handleFileChange} hidden />
      </label>

      {file && <p className="po-filename">{file.name}</p>}
    </>
  ) : (
    <div className="po-pdf-preview">
  {processedPages
    .filter((_, idx) => parsePagesInput(pagesInput, processedPages.length).includes(idx))
    .map((src, idx) => (
      <img key={idx} src={src} alt={`Page ${idx + 1}`} />
    ))}
</div>

  )}
</div>


          
        </div>

        {/* Right Section - Options + Summary */}
        <div className="po-summary-card">
          <h3>Print Options</h3>
          <label>Number of Pages</label>
          <input
  type="text"
  placeholder="e.g. 1-5,7,9"
  value={pagesInput}
  onChange={(e) => setPagesInput(e.target.value)}
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

          <button className="po-selectshop-btn">Select Shop</button>
          <button className="po-placeorder-btn">Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
