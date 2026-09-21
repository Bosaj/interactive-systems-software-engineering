import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useState, useEffect } from "react";
import Products from "./Products";
import ProductDetails from "./ProductDetails";

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Products} />
          <Route path="/product/:id" component={ProductDetails} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;






/*
import { useState, useEffect } from 'react';

const App = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts =  async () => {
            try {
                const response = await fetch("https://fakestoreapi.com/products");
                const data = await response.json();
                setProducts(data);
            } catch(error) {
                console.log(error.message);
            }
        };

        fetchProducts();;
    }, []);

    return (
        <div className="products-container">
            <h2>Products</h2>
            <div className="grid-container">
                {products.map((product) => (
                    <div className="product-card" key={product.id}>
                        <img src={product.image} alt={product.title} style={{ maxWidth: '200px' }}/>
                        <div className="product-details">
                            <h3>{product.title}</h3>
                            <p>{product.price}</p>
                            <p>{product.category}</p>
                            <p>{product.description}</p>
                        </div>
                    </div>    
                ))}
            </div>
        </div>
    );
};

export default App;
*/







/*
import { useState, useEffect } from "react";

const App = () => {
    const [posts, setPosts] = useState([]);
    const [users,setUsers] = useState([]);

    useEffect(() => {
        const fetchPosts = async() => {
            try {
                const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10");
                const data = await response.json();
                setPosts(data); 
            } catch (error) {
                console.log(error.message);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch("https://jsonplaceholder.typicode.com/users");
                const data = await response.json();
                setUsers(data);
            }catch (error) {
                console.log(error.message);
            }
        };

        fetchPosts();
        fetchUsers();
    }, []);

    return (
        <div>
            <div className = "post-container">
                {posts.map((post) => {
                    return (
                        <div className = "post-card" key={post.id}>
                            <h2 className="post-title">{post.title}</h2>
                            <p className="post-body">{post.body}</p>
                            <div className="button">
                                <div className="delete-btn">Delete</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="users-container">
                <h2>Users</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;
*/