import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import loadable from '@loadable/component';
import Typography from '@mui/material/Typography';

import AppHome from "./AppHome/index.js";
import Login from "./Login/index.js";
import SignUp from "./Signup/index.js";
import Logout from "./logout.js";
import AppLayout from "./Layout/index.js";
import ErrorPage from "./errorPage.js";
import DayWisePackageBuilder from "./PackageBuilder/index.js";

const PBHome = loadable(
  () => import('./Homepage/index.js'), 
  { 
    fallback: <p>...</p>
  }
);

const router = createBrowserRouter([
  //Unprotected Routes
  {
    path: "/",
    element: <PBHome />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/logout",
    element: <Logout />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },


  // Protected Routes

  {
    path: "/home",
    element: (
      <AppLayout>
        <AppHome />
      </AppLayout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/itinerary",
    element: (
      <AppLayout>
        <DayWisePackageBuilder />
      </AppLayout>
    ),
    errorElement: <ErrorPage />,
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
