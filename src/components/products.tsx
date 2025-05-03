import { useState } from "react";
import Product from "../types/Product";
import ProductDetails from "./productDetails";
import "./products.css";
import { Button } from 'primereact/button';

import Icon from "react-crud-icons";
import "react-crud-icons/dist/css/react-crud-icons.css";

interface ProductListProps {
    data: Product[]
    hideSearchBar: () => void;
    showSearchBar: () => void;
}

const Products: React.FC<ProductListProps> = ({ data, hideSearchBar, showSearchBar }) => {

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const hideBar = () => {
    // Trigger the hideSearchBar function
    hideSearchBar();
  };

  const showBar = () => {
    showSearchBar();
  }

  if (selectedProduct) {
    // Render the ProductDetails component when a product is selected

    return (
      <ProductDetails
        product={selectedProduct}
        onClose={
          () => {
            setSelectedProduct(null);
            showBar();
          } // Function to go back
      }
      />
    );
  }

  return (
    <ul className="list-group list-group-flush overflow-container">
      { data.map((product: Product) => (
        <Button text raised key={product.id} className="p-button-lg product-item"
          onClick={
            () => { 
              setSelectedProduct(product);
              hideBar();
            }}>
          <div className="product-preview">
            {product.id} - {product.category} - {product.price}
          </div>
          <Icon
            name="edit"
            className="edit-button"
          />
          <Icon
            name="delete"
            className="delete-button"
          />

        </Button>

      ))}
    </ul>
  );
}

export default Products;
