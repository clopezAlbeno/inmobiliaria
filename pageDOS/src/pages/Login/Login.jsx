import React, { useState, useEffect, useContext } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { AuthContext } from "../../Index";
import axios from "axios";
import Alert from "@mui/material/Alert";
import {enqueueSnackbar} from 'notistack'
import { useLocation } from "react-router-dom";

export const Login = () => {
  const location = useLocation()
  const { dataUser, setDataUser } = useContext(AuthContext);
  const { loggedIn, setLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormLogin({
      ...formLogin,
      [e.target.name]: e.target.value,
    });
  };


  const getInfo = async (token) => {
    try {
      let headers = {
        "content-type": "application/json",
        Authorization: token,
      };
      const { data } = await axios.get("http://localhost:3200/user/getInfo", {
        headers: headers,
      });
      setDataUser(data.user);
    } catch (err) {
      console.log(err);
    }
  };


  const sendLogin = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3200/user/login",
        formLogin
      );
      enqueueSnackbar(data.message, {
        variant: "success",
        autoHideDuration: 1900,
        anchorOrigin: { vertical: 'top', horizontal: 'center'},
      });
      setLoggedIn(true);
      getInfo(data.token);
      localStorage.setItem("token", data.token);
      navigate(-1);
    } catch (err) {
      enqueueSnackbar(err.response.data.message, {
        variant: "error",
        autoHideDuration: 2000,
        anchorOrigin: { vertical: 'top', horizontal: 'center'},
      });
      console.log(err.response);
    }
  };

  return (
    <>
      <div className="containerLogin">
        <div className="IntroductionLogin">
          <img src="./src/assets/LoginPage.jpg" alt="" />
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
              <label>Correo Electrónico</label>
              <input type="text" name="email" onChange={handleChange} />
            </div>
            <div>
              <label>Contraseña</label>
              <input type="password" name="password" onChange={handleChange} />
            </div>
            <span>
              Aun no tienes cuenta? <Link to={"/register"}>Regístrate</Link>
            </span>
            <button onClick={sendLogin}>Ingresar</button>
          </div>
        </div>
      </div>
    </>
  );
};
