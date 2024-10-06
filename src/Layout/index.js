/* eslint-disable react-hooks/exhaustive-deps */
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import React, { useEffect, useMemo, useState } from "react";
import { useHref, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

import Navbar from '../Navbar/index.js';
import PublicNavbar from '../Navbar/publicNavbar.js';
import { MainContext } from "../Utility";

const RedirectComponent = () => {
  useEffect(() => {
    window.location = "/login";
  }, []);
};

function PrivateRoute({ children, authed = false, props }) {
  if (typeof window !== "undefined") {
    if (authed) return <>{children}</>;
    else return <RedirectComponent />;
  } else {
    return null;
  }
}

const AppLayout = ({ children, showNavBar = true }) => {
  const userData = JSON.parse(localStorage.getItem("user") || null);
  const isLoggedIn = Boolean(userData);
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const contextValue = useMemo(
    () => ({
      userData,
      isLoggedIn,
    }),
    [userData, isLoggedIn]
  );

  const navigate = useNavigate();

  return (<>
    <PrivateRoute authed={isLoggedIn}>
      <MainContext.Provider value={contextValue}>
        <div id="myDiv" className="animate-bottom">
          {showNavBar && isLoggedIn ? <Navbar /> : <PublicNavbar />}
          <Box sx={{ mx: isMobile ? 1 : 5 }} fixed>
            <Box component="main" sx={{ pt: 9, pb: 2, margin: 'auto' }}>
              {children}
            </Box>
          </Box>
        </div>
      </MainContext.Provider>
    </PrivateRoute>
  </>);
};

export default AppLayout;
