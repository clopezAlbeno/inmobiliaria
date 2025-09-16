import { Outlet, Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./Dashboard.css";
import fondo1 from '../../assets/fondoCarrusel2.jpg';
import fondo2 from '../../assets/SolucionesMedida.png';
import fondo3 from '../../assets/fondoCarrusel1.jpg';
import apartamento1 from '../../assets/apartamento1.png';
import apartamento2 from '../../assets/apartamento2.png';
import ceg from '../../assets/ceg.png';
import altamira from '../../assets/altamira.png';
import imexvi from '../../assets/imexvi.png';
import insyss from '../../assets/insyss.png';
import torreFuerte from '../../assets/torreFuerte.png';
import { HouseCard } from '../../components/HouseCard/HouseCard.jsx'; 


export const Dashboard = () => {

  
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });
  const controls = useAnimation();
  const textos = [
    "SERVICIOS PROFESIONALES DE INFORMÁTICA PARA EMPRESAS",
    "",
    "GRUPO DOS",
  ];

  const properties = [
  {
    id: 1,
    title: 'Edificio en Zona 10, Guatemala',
    price: '25,000',
    currency: 'US$',
    transactionType: 'EN RENTA',
    image: apartamento2,
    area: '3,145'
  },
  {
    id: 2,
    title: 'Bodega en Villa Canales',
    price: '997.50 por m²',
    currency: 'US$',
    transactionType: 'EN VENTA',
    image: apartamento1,
    area: '400'
  },
  {
    id: 3,
    title: 'Bodega en Villa Canales',
    price: '997.50 por m²',
    currency: 'US$',
    transactionType: 'EN VENTA',
    image: apartamento1,
    area: '400'
  },
  {
    id: 4,
    title: 'Bodega en Villa Canales',
    price: '997.50 por m²',
    currency: 'US$',
    transactionType: 'EN VENTA',
    image: apartamento1,
    area: '400'
  },
  {
    id: 5,
    title: 'Bodega en Villa Canales',
    price: '997.50 por m²',
    currency: 'US$',
    transactionType: 'EN VENTA',
    image: apartamento1,
    area: '400'
  },
  {
    id: 6,
    title: 'Bodega en Villa Canales',
    price: '997.50 por m²',
    currency: 'US$',
    transactionType: 'EN VENTA',
    image: apartamento1,
    area: '400'
  },
  {
    id: 7,
    title: 'Bodega en Villa Canales',
    price: '997.50 por m²',
    currency: 'US$',
    transactionType: 'EN VENTA',
    image: apartamento1,
    area: '400'
  },
  {
    id: 8,
    title: 'Bodega en Villa Canales',
    price: '997.50 por m²',
    currency: 'US$',
    transactionType: 'EN VENTA',
    image: apartamento1,
    area: '400'
  }
];

  const imagenes = [fondo1, fondo2, fondo3];
  
  const [isVisible, setIsVisible] = useState(false);
  const [indice, setIndice] = useState(0);
  const [navbarStyle, setNavbarStyle] = useState("transparent");
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    empresa: '',
    descripcion: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, telefono, correo, descripcion } = formData;

    if (!nombre || !telefono || !correo || !descripcion) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Por favor, completa todos los campos obligatorios',
      });
      return;
    }

    try {
      const response = await fetch('http://157.230.178.146:3200/formularios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Formulario enviado',
          text: 'Nos pondremos en contacto contigo pronto',
        });

        // Limpiar campos
        setFormData({
          nombre: '',
          telefono: '',
          correo: '',
          empresa: '',
          descripcion: '',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al enviar el formulario',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar con el servidor',
      });
      console.error(error);
    }
  };

  const settings = {
    infinite: true,  // Hace que el carrusel sea infinito
    speed: 4000,     // Velocidad de la transición
    slidesToShow: 3, // Cantidad de imágenes visibles
    slidesToScroll: 1, // Cuántas imágenes avanza por transición
    autoplay: true,  // Se mueve automáticamente
    autoplaySpeed: 2000, // Tiempo entre transiciones
    cssEase: "linear" // Hace que el movimiento sea fluido
  };

  const empresas = [
    { id: 1, img: ceg },
    { id: 2, img: altamira },
    { id: 3, img: imexvi },
    { id: 4, img: insyss} ,
    { id: 5, img: torreFuerte }
  ];

  useEffect(() => {
    let timeout;
    
    const handleScroll = () => {
      const carrusel = document.querySelector(".carrusel");
      if (carrusel) {
        const rect = carrusel.getBoundingClientRect();
        if (rect.bottom > 50) {
          timeout = setTimeout(() => setNavbarStyle("transparent"), 200);
        } else {
          timeout = setTimeout(() => setNavbarStyle("blue"), 200);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(".crm-section");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  const intervalo = setInterval(() => {
    setIndice((prev) => (prev + 1) % imagenes.length);
  }, 4000);

  return () => clearInterval(intervalo);
}, [imagenes]);

  const [rotateGear, setRotateGear] = useState(0);

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, controls]);

  useEffect(() => {
    const handleScroll = () => {
      setRotateGear((prev) => prev + 5); // La tuerca gira al hacer scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".service-box");
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("visible"); 
      }, index * 300);
    });
  }, []);

  

  return (
    <>
      <div className="dashboard-container">
        {/* Navbar 
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
        */}

        

        <div className="body">
          {/* Introduction */}
        <div className="backgroundHP"></div>
        <div className={"titleHP"}>
          <span>Barra busqueda</span>
          <span>Inmoviliaria Test</span>
        </div>
        <div className={"introductionHP"}>
          <div className="buttonIntroduction">
            <button>¡BIENVENIDO!</button>
          </div>
          <div className="textIntroduction">
            Propiedades recientemente agregadas
          </div>
        </div>
          {/*}
          <section className="carrusel">
            <div className="carrusel-container">

              <div className="imagenes-carrusel">
              <div className=""><img  alt="" /></div>
                <AnimatePresence mode="wait">
                {imagenes.length > 0 && (
                  <motion.img
                    key={indice}
                    src={imagenes[indice]}
                    alt="Fondo"
                    className="fondo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  />
                )}
              </AnimatePresence>
              </div>
              <div className="texto-container">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={textos[indice]}
                    className="texto-inicial"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 1 }}
                  >
                    {textos[indice]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>
          */}

          <section ref={sectionRef} className="redes-section">
              {/* Tuerca giratoria 
                <motion.img
                  src={telefono}
                  alt=""
                  className="telefono"
                  initial={{ opacity: 0, y: 50 }}
                  animate={controls}
                  transition={{ duration: 0.8 }}
                />
                <motion.img
                  src={mensajes}
                  alt="mensajes"
                  className="mensajes"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [1, 1.5, 0.8, 1.2, 1],
                  }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
                <motion.img
                  src={escudo}
                  alt="escudo"
                  initial={{ opacity: 0, y: -50 }}
                  animate={controls}
                  transition={{ duration: 0.8 }}
                />
              
              */}
              <section className="properties-list-section">
                <div className="properties-grid">
                  {properties.map(property => (
                    <HouseCard
                      key={property.id}
                      title={property.title}
                      price={property.price}
                      currency={property.currency}
                      transactionType={property.transactionType}
                      image={property.image}
                      bedrooms={property.bedrooms}
                      bathrooms={property.bathrooms}
                      area={property.area}
                    />
                  ))}
                </div>
              </section>
          </section>

          

          {/* seccion carrusel empresas que han confiado en nosotros */}
          <section className="empresas">
            <h3>NUESTROS ASESORES</h3>
            <div>
              <Slider {...settings}>
                {empresas.map((empresa) => (
                  <div key={empresa.id} className="empresa-slide">
                    <img src={empresa.img} alt={`Empresa ${empresa.id}`} style={{ width: "250px", height: "160px", objectFit: "contain" }} />
                  </div>
                ))}
              </Slider>
            </div>
          </section>

          {/* Formulario */}
          <section className="form-section" id="contacto">
            <div className="form">
              <h2>Agenda una reunión</h2>
              <form onSubmit={handleSubmit}>
                <label>Nombre*</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Tu nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                />

                <label>Teléfono*</label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Tu teléfono"
                  required
                  value={formData.telefono}
                  onChange={handleChange}
                />

                <label>Dirección de correo*</label>
                <input
                  type="email"
                  name="correo"
                  placeholder="Tu correo"
                  required
                  value={formData.correo}
                  onChange={handleChange}
                />

                <label>Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  placeholder="Nombre de la empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                />

                <label>Descripción*</label>
                <textarea
                  name="descripcion"
                  placeholder="Describe tu solicitud"
                  required
                  value={formData.descripcion}
                  onChange={handleChange}
                ></textarea>

                <button type="submit">Agendar reunión</button>
              </form>
            </div>
          </section>

          {/* Footer */}
          <footer className="footer">
            <div className="footer-container">
              <div className="footer-brand">
                <h2>
                  <span className="highlight">GRUPO DOS</span> GUATEMALA
                </h2>
                <p>Agenda una reunión virtual para afinar tus detalles</p>
                <button className="btnFooter" >Agendar reunión</button>
              </div>

              <div className="footer-section">
                <h3>SERVICIOS</h3>
                <ul>
                  <li>Desarrollo de software</li>
                  <li>SEO</li>
                  <li>Diseño web</li>
                </ul>
              </div>

              <div className="footer-section">
                <h3>POLITICAS</h3>
                <ul>
                  <li>Términos y condiciones de uso</li>
                  <li>Política de privacidad</li>
                  <li>Políticas de Cookies</li>
                </ul>
              </div>

              <div className="footer-section">
                <h3>REDES</h3>
                <ul className="social-links">
                  <li><a href="https://www.facebook.com/grupodos.gt" target="_blank" rel="noopener noreferrer"> <img width="28" height="28" src="https://img.icons8.com/color/48/facebook.png" alt="facebook" /> Facebook </a></li>
                  <li ><a href="https://www.instagram.com/somosdos.gt/#" target="_blank" rel="noopener noreferrer"><img width="28" height="28" src="https://img.icons8.com/fluency/48/instagram-new.png" alt="instagram-new" /> Instagram </a></li>
                  <li><a href="http://wa.me/+50243627088" target="_blank" rel="noopener noreferrer"><img width="28" height="28" src="https://img.icons8.com/color/48/whatsapp--v1.png" alt="whatsapp"/> Whatsapp </a></li>
                </ul>
              </div>
            </div>
          </footer>

        </div>
        <Outlet />
      </div>
    </>
  );
};
