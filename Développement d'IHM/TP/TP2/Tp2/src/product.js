
import React from 'react';

function Product({ id, title, price, thumbnail, addToCart, isInCart }) {
    return (
        <div id={'produit' + id}>
            <img src={'/images/' + thumbnail} alt={title} /><br />
            <p>{title}</p><br />
            <p>{price}</p><br />
            {isInCart ? (
              <p>Ajouté au panier</p>
            ) : (
              <button onClick={() => addToCart(id)}>Ajouter au panier</button>
            )}
        </div>
    );
}
export default Product;
