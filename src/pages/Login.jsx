import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/login.css'; 
import { useNavigate } from 'react-router-dom';

function Login() {

  const navigate = useNavigate();

  const handleSubmit = (e) => {
  e.preventDefault();

  // Aqui ira la validacion
  console.log("Intentando iniciar sesión...");
  navigate('/dashboard');
};

  

  

  return (
    <div id="fondo">
      <section className="form-section" id="principal">
        <div className="container text-center" id="tarjeta">
          <h2>Iniciar Sesión</h2>
          <form className="needs-validation" onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input type="email" className="form-control" id="email" placeholder="Ingresa tu correo electrónico" required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label"> Contraseña</label>
              <input type="password" className="form-control" id="password" placeholder="Ingresa tu contraseña" required />
            </div>
            <button type="submit" className="btn" id="btn-iniciar-sesion">Iniciar Sesión</button>
          </form>
          <div className="container text-center mt-3">
            <p>¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link></p>
          </div>
        </div>
      </section>
    </div>
  );
}



export default Login;