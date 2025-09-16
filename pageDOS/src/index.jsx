import React, { useState, useEffect, createContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx"
import { NotFoundPage } from "./NotFoundPage.jsx";
import { Dashboard } from "./pages/Dashboard/Dashboard.jsx";
import { RentPage } from "./pages/RentPage/RentPage.jsx"; 

export const AuthContext = createContext();

export const Index = () => {

  const routes = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <NotFoundPage />,
      children: [
        {
          path: "/",
          element: <Dashboard />
        },
        {
          path: "/rentas",
          element: <RentPage />
        }
      ]
    }]);
  return (
    <AuthContext.Provider>
      <RouterProvider router={routes}></RouterProvider>
    </AuthContext.Provider>
  );
};
