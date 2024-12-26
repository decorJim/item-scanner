import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import "./ListGroup.css";
import Product from "../types/Product";
import Products from "./products";
import { FaBarcode } from "react-icons/fa";

function ListGroup() {
  const [inputText, setInputText] = useState("");
  const [data, setData] = useState<Product[]>([]);

  const [isSearchBarVisible, setSearchBarVisibility] = useState(true);

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
      <FaBarcode className="barcode-icon" />
      detect barcode
      <Products data={filteredData} hideSearchBar={hideSearchBar} showSearchBar={showSearchBar}/>
    </div>
  );
}

export default ListGroup;
