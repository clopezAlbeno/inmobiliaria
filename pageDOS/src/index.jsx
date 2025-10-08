import React, { useState, useEffect, createContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx"
import { NotFoundPage } from "./NotFoundPage.jsx";
import { Dashboard } from "./pages/Dashboard/Dashboard.jsx";
import { RentPage } from "./pages/RentPage/RentPage.jsx"; 
import { SalesPage } from "./pages/SalesPage/SalesPage.jsx";
import { PropertyDetail } from "./pages/PropertyDetail/PropertyDetail.jsx";
import { AdminLogin } from "./pages/Admin/AdminLogin.jsx";
import { AdminPanel } from "./pages/Admin/AdminPanel.jsx";

export const AuthContext = createContext();

export const Index = () => {
  const [user, setUser] = useState(null);

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
        },
        {
          path: "/ventas",
          element: <SalesPage />
        },
        {
          path: "/property/:id",
          element: <PropertyDetail />
        }
      ]
    },
    {
      path: "/admin",
      element: <AdminLogin />,
    },
    {
      path: "/admin/panel",
      element: <AdminPanel />,
    }
  ]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <RouterProvider router={routes}></RouterProvider>
    </AuthContext.Provider>
  );
};