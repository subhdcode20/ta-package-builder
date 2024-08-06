/* eslint-disable react-hooks/exhaustive-deps */
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import React, { useEffect, useMemo, useState } from "react";
import { useHref, useNavigate } from "react-router-dom";

import Navbar from '../Navbar/index.js';
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
          {showNavBar && <Navbar />}
          <Container maxWidth="md" fixed>
            <Box component="main" sx={{ pt: 9, pb: 2 }}>
              {children}
            </Box>
          </Container>
        </div>
      </MainContext.Provider>
    </PrivateRoute>
  </>);
};

export default AppLayout;
