import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importamos las páginas (tienes que crearlas en la carpeta pages)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Importamos componentes globales
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      {/* El Navbar y Footer se quedan fijos en todas las rutas */}
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;