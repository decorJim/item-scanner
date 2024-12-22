import { useState } from "react";
import Product from "../types/Product";
import ProductDetails from "./productDetails";
import "./products.css";

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
        <li key={product.id} className="list-group-item product-item" 
          onClick={
            () => { 
              setSelectedProduct(product);
              hideBar();
            }}>
          {product.id} - {product.category} - {product.price}
        </li>
      ))}
    </ul>
  );
}

export default Products;
