import './assets/css/App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Forms from './pages/Forms';
import CRUD_API from './pages/CRUD_API';
import RouteParam from './pages/RouteParam';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/forms' element={<Forms/>} />
        <Route path='/crud-api' element={<CRUD_API/>} />
        <Route path='/route-param/:id' element={<RouteParam />} />
      </Routes>
    </div>
  );
}

export default App;
