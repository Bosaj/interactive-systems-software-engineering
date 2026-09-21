//question1--------------------------------------------------

/*import React, { useState, useEffect } from 'react';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Liste des 10 premiers posts :</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

//------------quesion2-----------------------------------------------------------------

import React, { useState, useEffect } from 'react';

const App = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="posts-container">
      {posts.map(post => (
        <div className="post-card" key={post.id}>
          <h2 className="post-title">{post.title}</h2>
          <p className="post-body">{post.body}</p>
          <div className="button">
            <div className="delete-btn">Delete</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;


//----------question3--------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';

const App = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <h1>Liste des utilisateurs :</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Téléphone: {user.phone}</p>
            <p>Site web: {user.website}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

//-------------------------question4---------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-container">
      <h1>Liste des produits :</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <h2>{product.title}</h2>
            <p>Catégorie: {product.category}</p>
            <p>Prix: ${product.price}</p>
            <img src={product.image} alt={product.title} style={{ maxWidth: '100px' }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

//----------------------Routage: ex1------------------------------------------------------------

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'; // Modifier l'importation
import Home from './Navigation/Home';
import About from './Navigation/About';
import Contact from './Navigation/Contact';

const App = () => {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
    </Router>
  );
};

export default App;*/

//---------------Routage: ex2----------------------------------------------------

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import ProductDetails from './ProductDetails'; // Importez le nouveau composant

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/product/:id" component={ProductDetails} /> {/* Nouvelle route */}
      </Switch>
    </Router>
  );
};

export default App;
