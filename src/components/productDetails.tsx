import Product from "../types/Product";


interface ProductDetailsProps {
    product: Product;
    onClose: () => void; // callback to go back to list 
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onClose }) => {
    return (
        <div className="product-details">
          <br></br>
          <h2>Product Details</h2>
          <br></br>
          <p><strong>ID:</strong> { product.id }</p>
          <p><strong>Name:</strong> { product.name }</p>
          <p><strong>Category:</strong> { product.category }</p>
          <p><strong>Price:</strong> ${ product.price }</p>
          <p><strong>Tax:</strong> { product.taxe ? 'Yes' : 'No'}</p>
          <button onClick={ onClose }>Back to List</button>
        </div>
      );
};

export default ProductDetails;


