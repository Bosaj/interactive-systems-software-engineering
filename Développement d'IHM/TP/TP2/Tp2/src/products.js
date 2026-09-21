
import React, { useState } from 'react';
import Product from './product';
import Search from './Search'; 

const Products = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const products = [
    {
        id: 1,
        title: 'PC Portable Gamer HP VICTUS',
        price: '7490 DH',
        thumbnail: 'HP16D0195NF.jpg'
    },
    {
        id: 2,
        title: 'PC Portable Gamer HP VICTUS',
        price: '2190 DH',
        thumbnail: 'HP14424U3EA.jpg'
    },
    {
        id: 3,
        title: 'Pc Portable Chromebook Acer',
        price: '3640 DH',
        thumbnail: 'NXATHEF002.jpg'
    },
    {
        id: 4,
        title: 'PC Portable - HUAWEI',
        price: '1270 DH',
        thumbnail: 'HUA6901443442959.jpg'
    },
  ];

  const addToCart = (productId) => {
    const productToAdd = products.find(product => product.id === productId);
    setCart([...cart, productToAdd]);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const cartItemCount = cart.length;

  return (
    <div>
      <Search onSearch={handleSearch} />
      <div>Nombre de produits dans le panier : {cartItemCount}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products.map(product => (
          <Product
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price} 
            thumbnail={product.thumbnail}
            addToCart={addToCart}
            isInCart={cart.some(item => item.id === product.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
