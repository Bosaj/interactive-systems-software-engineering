import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const ProductDetails = ({ match }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${match.params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error.message);
      }
    };

    fetchProductDetails();
  }, [match.params.id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div>
        <h1>{product.title}</h1>
        <p>Category: {product.category}</p>
        <p>Price: ${product.price}</p>
        <p>Description: {product.description}</p>
        <img src={product.image} alt={product.title} style={{ maxWidth: '200px' }} />
      </div>
    </div>
  );
};

export default ProductDetails;

// ex2 : question2-------------------------
