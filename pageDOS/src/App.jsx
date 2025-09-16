import { Outlet, Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from './assets/logoSinFondo.png'; // Asegúrate de que la ruta sea correcta

const App = () => {
  const location = useLocation();
  const [navbarStyle, setNavbarStyle] = useState("blue");

  useEffect(() => {
    // Si la ruta es la principal ('/'), establece el estilo a 'transparent'.
    if (location.pathname === '/') {
      setNavbarStyle("transparent");
    } else {
      // En cualquier otra ruta, establece el estilo a 'blue'.
      setNavbarStyle("blue");
    }
    
    // Si quieres que el navbar tenga una lógica de scroll en la página de inicio,
    // puedes agregarla aquí. Si no, solo con la lógica de arriba es suficiente.
    const handleScroll = () => {
      if (location.pathname === '/') {
        const isScrolled = window.scrollY > 50;
        setNavbarStyle(isScrolled ? "blue" : "transparent");
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  return (
    <>
      <nav className={`navbar ${navbarStyle}`}>
          <div className="logo"><img src={logo} alt="" /></div>
          <div className="nav-links">
            <Link to="/">INICIO</Link>
            <Link to="/rentas">RENTAS</Link>
            <Link to="/ventas">VENTAS</Link>
            <Link to="/proyectos">PROYECTOS</Link>
            <a href="#asesores">NUESTROS ASESORES</a>
            <a href="#propietarios">PROPIETARIOS</a>
            <a href="#contacto">CONTÁCTANOS</a>
          </div>
        </nav>
      <Outlet />
    </>
  );
};

export default App;