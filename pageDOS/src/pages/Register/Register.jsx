import React, { useState, useEffect } from "react";
import "./Register.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useSnackbar } from "notistack";
import axios from "axios";

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation()

  const { enqueueSnackbar } = useSnackbar();
  const [formRegister, setFormRegister] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormRegister({
      ...formRegister,
      [e.target.name]: e.target.value,
    });
  };

  const sendRegister = async () => {
    try {
      const {data} = await axios.post("http://localhost:3200/user/register", formRegister);
      enqueueSnackbar(data.message, {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'center'},
      });
      navigate("/login");
    } catch (err) {
      enqueueSnackbar(err.response.data.message, {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'center'},
      });
      console.log(err.response);
    }
  };

  return (
    <>
      <div>
        <div className="containerLogin">
          <div className="IntroductionRegister">
            <img src="./src/assets/RegisterPage.jpg" alt="" />
          </div>
          <div className="formLogin">
            <CloseOutlinedIcon
              className="closeLogin"
              fontSize="large"
              onClick={() => {
                navigate(-1);
              }}
            />
            <div className="contentFormLogin">
              <h1>ECOmpany</h1>
              <div>
                <label>Nombres</label>
                <input type="text" name="name" onChange={handleChange} />
              </div>
              <div>
                <label>Apellidos</label>
                <input type="text" name="surname" onChange={handleChange} />
              </div>
              <div>
                <label>Correo Electrónico</label>
                <input type="text" name="email" onChange={handleChange} />
              </div>
              <div className="infoRegister">
                <div>
                  <label>Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Teléfono</label>
                  <input type="text" name="phone" onChange={handleChange} />
                </div>
              </div>
              <span>
                Ya tienes una cuenta? <Link to={"/login"}>Inicia sesión</Link>
              </span>
              <button onClick={sendRegister}>Crear cuenta</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
