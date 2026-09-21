import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/forms">Forms</Link></li>
        <li><Link to="/crud-api">CRUD API</Link></li>
        <li><Link to="/route-param/1">Route param</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar