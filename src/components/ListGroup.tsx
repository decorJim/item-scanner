import { useState, useEffect, useCallback, useRef } from "react";
import TextField from "@mui/material/TextField";
import "./ListGroup.css";
import Product from "../types/Product";
import Products from "./products";
import { FaBarcode } from "react-icons/fa";
import BarCodeScanner from 'barcode-react-scanner';

import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';

function ListGroup() {
  // 1. Define higher-resolution constraints
  const videoConstraints = {
    facingMode: 'environment',
    width: { ideal: 3000 },   // or any resolution you prefer
    height: { ideal: 900 },
  };

  const [inputText, setInputText] = useState("");
  const [data, setData] = useState<Product[]>([]);
  const [isSearchBarVisible, setSearchBarVisibility] = useState(true);
  const [barcode, setBarcode] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);

  // Toggle for the webcam-based scanner
  const [isWebcamScannerActive, setWebcamScannerActive] = useState(false);

  const webcamRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const codeReaderRef = useRef<any>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hideSearchBar = () => {
    setSearchBarVisibility(false);
  };

  const showSearchBar = () => {
    setSearchBarVisibility(true);
  };

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert input text to lowercase
    setInputText(e.target.value.toLowerCase());
  };

  const getData = () => {
    fetch("temp.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((jsonBody) => {
        setData(jsonBody);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // Capture and scan using the webcam feed
  const captureAndScan = useCallback(() => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) {
      return;
    }

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // 2. (Optional) Adjust scanning region if you'd like to make it bigger
    const sx = videoWidth * 0.1;
    const sy = videoHeight * 0.1;
    const sw = videoWidth * 0.8;
    const sh = videoHeight * 0.8;

    // Resize canvas to the region size and draw that portion of the video frame
    canvas.width = sw;
    canvas.height = sh;
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);

    // Convert canvas to image data URL and decode
    const frameImage = canvas.toDataURL('image/png');
    codeReaderRef.current
      .decodeFromImage(undefined, frameImage)
      .then((result: { getText: () => any }) => {
        if (result) {
          const detectedText = result.getText();
          if (detectedText && detectedText !== barcode) {
            setBarcode(detectedText);
          }
        }
      })
      .catch((err: any) => {
        // Decoding error or no barcode found
        console.error(err)
      });
  }, [barcode]);

  useEffect(() => {
    getData();
    codeReaderRef.current = new BrowserMultiFormatReader();
  }, []);

  // Start or stop scanning when isWebcamScannerActive changes
  useEffect(() => {
    if (isWebcamScannerActive) {
      scanIntervalRef.current = setInterval(() => {
        captureAndScan();
      }, 500);
    } else {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
    };
  }, [isWebcamScannerActive, captureAndScan]);

  // Filter data based on inputText
  const filteredData = data.filter((product) =>
    product.name.toLowerCase().includes(inputText)
  );

  const handleBarcodeUpdate = (err: any, res: any) => {
    // if a code is detected
    if (res) {
      setBarcode(res.getText());
      setIsScanning(false);
    }
    if (err) {
      console.error("Error scanning barcode:", err);
    }
  };

  const toggleScanner = () => {
    setIsScanning((prev) => !prev);
  };

  const toggleWebcamScanner = () => {
    setWebcamScannerActive((prev) => !prev);
  };

  return (
    <div className="outer-container">
      <div className="search-bar-container">
        {isSearchBarVisible && (
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            onChange={inputHandler}
            label="Search"
            sx={{
              maxWidth: "500px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        )}

        <div>
          { isSearchBarVisible && (<FaBarcode className="barcode-icon" onClick={toggleScanner} />)}
        </div>

        { isSearchBarVisible &&  ( 
          <button onClick={toggleWebcamScanner} style={{ marginLeft: '1rem' }}>
              {isWebcamScannerActive ? 'Stop Webcam Scanner' : 'Start Webcam Scanner'}
          </button>
        )}

        {/* Conditionally render the webcam scanner */}
        {isWebcamScannerActive && (
          <div style={{ position: 'relative', marginTop: '1rem' }}>
            {/* 3. Pass the new videoConstraints here */}
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/png"
              videoConstraints={videoConstraints}
              style={{ width: '100%', maxWidth: '800px' }}
            />
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '25%',
                width: '50%',
                height: '30%',
                border: '2px solid red',
                pointerEvents: 'none',
              }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}
      </div>

      {/* Display Scanned Barcode */}
      {barcode && <p>Scanned Barcode: {barcode}</p>}

      {isScanning && <BarCodeScanner onUpdate={handleBarcodeUpdate} />}

      <Products data={filteredData} hideSearchBar={hideSearchBar} showSearchBar={showSearchBar} />
    </div>
  );
}

export default ListGroup;
