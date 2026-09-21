import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    <div className="product-details">
      {product ? (
        <>
          <h2 className="product-title">{product.title}</h2>
          <p className="product-description">{product.description}</p>
          <div className="product-price">${product.price}</div>
          <div className="product-category">{product.category}</div>
          {/* Add other product details you want to display */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProductDetails;
