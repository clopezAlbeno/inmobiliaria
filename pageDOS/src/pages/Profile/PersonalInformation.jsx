import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MainInformation } from "../../Components/PersonalInformation/MainInformation";
import { ChangePhoto } from "../../Components/ChangePhoto/ChangePhoto";
import { ChangePassword } from "../../Components/ChangePassword/ChangePassword";

export const PersonalInformation = () => {
  const [profile, setProfile] = useState({});
  const { id } = useParams();

  const headers = {
    "content-types": "aplication/json",
    Authorization: localStorage.getItem("token"),
  };

  const getMyProfile = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3200/user/searchById/${id}`,
        { headers: headers }
      );
      setProfile(data.user);
    } catch (err) {
      console.log(err.response);
    }
  };

  const [imageUser, setImageUser] = useState(null);
  const getMyPhoto = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3200/user/getPhoto/${id}`,
        { responseType: "blob" }
      );
      const myImage = URL.createObjectURL(data);
      setImageUser(myImage);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getMyProfile();
    getMyPhoto();
  }, []);

  // cambiar de vista
  const [view, setView] = useState({
    main: "active",
    photo: "",
    pass: "",
  });
  const changeView = (e) => {
    const active = Object.keys(view).find((item) => view[item] == "active");
    setView({
      ...view,
      [active]: "",
      [e.target.id]: "active",
    });
  };

  return (
    <>
      <div className="containerPI">
        <div className="contentPI">
          <div className="headerPI">
            <img src={imageUser} alt={profile.email} />
            <h1>{profile.email}</h1>
          </div>
          <div className="formInformation">
            {profile.email == "admin" || profile.email == "deletedAccount" ? (
              <></>
            ) : (
              <div className="formHeader">
                <label className={view.main} id="main" onClick={changeView}>
                  Principal
                </label>
                <label className={view.photo} id="photo" onClick={changeView}>
                  Foto de Perfil
                </label>
                <label className={view.pass} id="pass" onClick={changeView}>
                  Contraseña
                </label>
              </div>
            )}

            {view.main == "active" ? (
              <MainInformation profile={profile} reload={getMyProfile}/>
            ) : view.photo == "active" ? (
              <ChangePhoto
                img={imageUser}
                profile={profile}
                reload={getMyPhoto}
              />
              ) : view.pass == "active" ? (
                <ChangePassword
                />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
