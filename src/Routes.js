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
import ViewReqsList from "./ViewRequests/index.js";
import PackagePdf from "./PackagePdf/index.js";
import UploadRatesheet from "./Ratesheet/index.js";

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
    path: "/itinerary/:reqId",
    element: (
      <AppLayout>
        <DayWisePackageBuilder />
      </AppLayout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/itinerary/:reqId/edit",
    element: (
      <AppLayout>
        <DayWisePackageBuilder />
      </AppLayout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/itinerary/:reqId/copy-new",
    element: (
      <AppLayout>
        <DayWisePackageBuilder />
      </AppLayout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/my-reqs",
    element: (
      <AppLayout> 
        <ViewReqsList />
      </AppLayout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/package/:packageId/pdf",
    element: (
      <PackagePdf/>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/upload-ratesheet",
    element: (
      <UploadRatesheet/>
    ),
    errorElement: <ErrorPage />,
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
