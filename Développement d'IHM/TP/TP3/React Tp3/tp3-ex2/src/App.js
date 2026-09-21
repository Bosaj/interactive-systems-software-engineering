import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import ProductDetails from './ProductDetails';

const Routes = () => {
  return (
    <Router>
      <Route exact path="/" component={App} />
      <Route path="/product/:productId" component={ProductDetails} />
    </Router>
  );
};

export default Routes;
