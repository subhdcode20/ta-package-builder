/* eslint-disable react-hooks/exhaustive-deps */
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import React, { useEffect, useMemo, useState } from "react";
import { useHref, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

import { db, auth } from "../firebaseConfig";
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
  let userData = JSON.parse(localStorage.getItem("user") || null);
  const isLoggedIn = Boolean(userData);
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

	useEffect(() => {
		const fetchUserIdToken = async () => {
			try {
				auth.onAuthStateChanged(async (user) => {
					if (user) {
						// user.getIdToken().then(function(data) {
						//   console.log(data)
						// });
						let signedInIdToken = await auth.currentUser.getIdToken(
							/* forceRefresh */ true,
						);
						console.log("signedInIdToken ", signedInIdToken, typeof signedInIdToken);
						localStorage.setItem('user', JSON.stringify({ ...userData, firebaseIdToken: signedInIdToken }));
            userData['firebaseIdToken'] = signedInIdToken;
					}
				});
			} catch (e) {
				console.log("signedInIdToken error ", e);
			}
		};

		fetchUserIdToken();
	}, []);

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
