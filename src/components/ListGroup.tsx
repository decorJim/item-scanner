import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import "./ListGroup.css";
import Product from "../types/Product";
import Products from "./products";
import { FaBarcode } from "react-icons/fa";
import BarCodeScanner from 'barcode-react-scanner';

function ListGroup() {

  const [inputText, setInputText] = useState("");
  const [data, setData] = useState<Product[]>([]);
  const [isSearchBarVisible, setSearchBarVisibility] = useState(true);
  const [barcode, setBarcode] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);

  const hideSearchBar = () => {
    setSearchBarVisibility(false);
  }

  const showSearchBar = () => {
    setSearchBarVisibility(true);
  }

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

  useEffect(() => {
    getData();
  }, []);

  // Filter data based on inputText
  const filteredData = data.filter((product) =>
    product.id.toLowerCase().includes(inputText)
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
  }

  const toggleScanner = () => {
    setIsScanning((prev) => !prev)
  }


  return (
    <div className="outer-container">

      {isSearchBarVisible && (<TextField
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
        <FaBarcode className="barcode-icon" onClick={toggleScanner}  />
      </div>

      {/* Display Scanned Barcode */}
      { barcode && <p>Scanned Barcode: {barcode}</p> }

      { isScanning && <BarCodeScanner onUpdate={handleBarcodeUpdate}/>}
      
      <Products data={filteredData} hideSearchBar={hideSearchBar} showSearchBar={showSearchBar}/>
    </div>
  );
}

export default ListGroup;
