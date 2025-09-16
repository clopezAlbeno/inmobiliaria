import React, { useState, useContext } from "react";
import { useParams, Link, Outlet } from "react-router-dom";
import "./Profile.css";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Divider } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ForumIcon from "@mui/icons-material/Forum";
import { AuthContext } from "../../Index";

export const Profile = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { dataUser, setDataUser } = useContext(AuthContext);
  const { id } = useParams();

  return (
    <>
      <SwipeableDrawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onOpen={() => setOpenDrawer(true)}
      >
        <Box
          sx={{ width: 250, height: "100%", background: "#2E8B57" }}
          onClick={() => setOpenDrawer(true)}
        >
          <List>
            <Link to={`personal-information/${id}`}>
              <ListItem>
                <ListItemButton>
                  <ListItemIcon>
                    <AccountCircleIcon sx={{ color: "#fff" }} />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ color: "#fff" }}
                    primary={"Datos Personales"}
                  />
                </ListItemButton>
              </ListItem>
            </Link>

            <Divider sx={{ background: "#fff" }} />
            <Link to={`cart/${id}`}>
              <ListItem>
                <ListItemButton>
                  <ListItemIcon>
                    <ShoppingCartIcon sx={{ color: "#fff" }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "#fff" }} primary={"Carrito"} />
                </ListItemButton>
              </ListItem>
            </Link>
            <Divider sx={{ background: "#fff" }} />
            <Link to={`shopping-history/${id}`}>
              <ListItem>
                <ListItemButton>
                  <ListItemIcon>
                    <LocalOfferIcon sx={{ color: "#fff" }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "#fff" }} primary={"Compras"} />
                </ListItemButton>
              </ListItem>
            </Link>

            <Divider sx={{ background: "#fff" }} />
            <Link to={`my-comments/${id}`}>
              <ListItem>
                <ListItemButton>
                  <ListItemIcon>
                    <ForumIcon sx={{ color: "#fff" }} />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ color: "#fff" }}
                    primary={"Comentarios"}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
            <Divider sx={{ background: "#fff" }} />
          </List>
        </Box>
      </SwipeableDrawer>
        {dataUser.rol == "USER" ? (
          <button className="openTabs" onClick={() => setOpenDrawer(!openDrawer)}>
            Ver
          </button>
        ) : (
          <></>
        )}
        <Outlet></Outlet>
    </>
  );
};
