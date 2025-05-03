import { useState, useEffect, useCallback, useRef } from "react";

import "./ListGroup.css";

import TextField from "@mui/material/TextField";
import Product from "../types/Product";
import Products from "./products";

import { Button } from 'primereact/button';

import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';

function ListGroup() {

  // small webcam constrains
  const videoConstraints = {
    facingMode: 'environment',
    width: { ideal: 3000 },  
    height: { ideal: 900 },
  };

  const [inputText, setInputText] = useState("");
  const [data, setData] = useState<Product[]>([]);
  const [isSearchBarVisible, setSearchBarVisibility] = useState(true);
  const [barcode, setBarcode] = useState<string>('');

  // Toggle for the webcam-based scanner
  const [isWebcamScannerActive, setWebcamScannerActive] = useState(false);

  // small used webcam
  const webcamRef = useRef<any>(null);

  const canvasRef = useRef<any>(null);
  const codeReaderRef = useRef<any>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* show or hide searchbar */
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
              maxWidth: "612px",
              marginLeft: "144px",
              marginRight: "24px",
            }}
          />
        )}

        { isSearchBarVisible &&  ( 
          <Button onClick={toggleWebcamScanner} className="webcam-button">
              {isWebcamScannerActive ? 'Stop Scanner' : 'Start Scanner'}
          </Button>
        )}
      </div>

      {isWebcamScannerActive && (
          <div className="display-cam-zone">
              <div className="webcam-wrapper"> 
                  <div style={{ position: 'static', marginTop: '1rem' }}>
                  {/* 3. Pass the new videoConstraints here */}
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/png"
                      videoConstraints={videoConstraints}
                      style={{ width: '100%', maxWidth: '800px' }}
                    />

                    {/* small red rectangle to focus on barcode */}
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
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          </div> )}
      
       {/* Display Scanned Barcode */}
       {isWebcamScannerActive && barcode && <p>Scanned Barcode: {barcode}</p>}

      <br></br>

      <Products data={filteredData} hideSearchBar={hideSearchBar} showSearchBar={showSearchBar} />
    </div>
  );
}

export default ListGroup;
