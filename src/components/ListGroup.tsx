import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import "./ListGroup.css";

interface Product {
  id: string;
  name: string;
  num: number;
  category: string;
  product: string;
  price: number;
  taxe: boolean;
}

function ListGroup() {
  const [inputText, setInputText] = useState("");
  const [data, setData] = useState<Product[]>([]);

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
      <ul className="list-group list-group-flush overflow-container">
        {filteredData.map((product: Product) => (
          <li key={product.id} className="list-group-item">
            {product.id} - {product.category} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListGroup;
