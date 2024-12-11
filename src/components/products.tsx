import { useState } from "react";
import Product from "../types/Product";
import ProductDetails from "./productDetails";

interface ProductListProps {
    data: Product[]
}

const Products: React.FC<ProductListProps> = ({ data }) => {

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (selectedProduct) {
    // Render the ProductDetails component when a product is selected
    return (
      <ProductDetails
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)} // Function to go back
      />
    );
  }

  return (
    <ul className="list-group list-group-flush overflow-container">
      { data.map((product: Product) => (
        <li key={product.id} className="list-group-item" 
          onClick={() => setSelectedProduct(product)}
          style={{ cursor: 'pointer' }} >
          {product.id} - {product.category} - {product.price}
        </li>
      ))}
    </ul>
  );
}

export default Products;
