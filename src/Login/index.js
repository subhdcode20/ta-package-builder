import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import React, { useState, useRef, useEffect } from "react";
// import { Helmet } from "react-helmet";

import { doc, getDoc } from "firebase/firestore";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import SnackbarMsg from "../Commons/snackbarMsg";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import LoadingButton from "../Commons/LoadingButton";
// import CopyrightFooter from "../Commons/copyright-footer";
import { auth, db } from "../firebaseConfig";
// import LoadingView from "../loading";
// import CabEasyLogo from "../utills/logoImgBox";

// const backgroundLogin = require("./11291.jpg");

export default function Login() {
  // Inputs
  const [mynumber, setnumber] = useState("");
  const [otp, setotp] = useState("");
  const [showOtpView, setShowOtpView] = useState(false);
  const [isLoginError, setLoginError] = useState(false);

  const [final, setfinal] = useState(null);
  const [userType, setUserType] = useState("agent");
  const [optVerified, setOptVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hideGetOtpBtn, setHideOtpButton] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  // const signInConfirm = useRef(null);

  const userData = JSON.parse(localStorage.getItem("user") || null);
  const isLoggedIn = useRef(Boolean(userData));

  useEffect(() => {
    console.log("isLoggedIn Login", isLoggedIn.current)
    if(isLoggedIn.current) navigate("/home");
  }, [isLoggedIn.current])

  // Sent OTP
  const signin = async () => {
    if (mynumber === "" || mynumber.length < 10) return;
    const finalPhone = `+91${mynumber}`;
    setLoading(true);
    let verify = null;
    try {
      verify = new RecaptchaVerifier("recaptcha-container", {}, auth);
    } catch {
      verify = new RecaptchaVerifier(auth, "recaptcha-container", {});
    }
    // let verify  = new RecaptchaVerifier("recaptcha-container", {}, auth);
    setHideOtpButton(true);
    console.log("signin captcha initialize ", auth, finalPhone, verify);
    signInWithPhoneNumber(auth, finalPhone, verify)
      .then((result) => {
        console.log("signin captcha result ", result);
        // signInConfirm.current = result
        setfinal(result);
        result && setLoading(false);
        // alert("code sent")
        setShowOtpView(true);
      })
      .catch((err) => {
        console.log("signin captcha error ", err);
        alert(err);
        setLoading(false);
        //reset captcha
        // window.recaptchaVerifier.render().then(function(widgetId) {
        //   grecaptcha.reset(widgetId);
        // });
        window.location.reload();
      });
  };

  const saveUserDetails = async () => {
    console.log("save user ---- ", mynumber);
    const docSnap = await getDoc(doc(db, "userDetails", `+91${mynumber}`));
    // docSnap, docSnap.exists(),
    if (docSnap.exists()) {
      console.log("save user data ", docSnap.data());
      localStorage.setItem("user", JSON.stringify(docSnap.data()));
      // navigate("/home");
    } else {
      console.log("doc doesnt exist..redirecting to signup");
      navigate("/signup");
    }
  };
  // Validate OTP
  const validateOtp = () => {
    if (otp === null || final === null) return;
    console.log("valid otp", otp, final);
    setLoading(true);
    final
      .confirm(otp)
      .then(async (result) => {
        console.log("otp success", result, result._tokenResponse);
        await saveUserDetails();
        setTimeout(() => {
          //   // setOptVerified(true);
          setLoading(false);
          navigate("/home");
        }, 2000);
        // redirect('/home');
      })
      .catch((err) => {
        console.log("otp error catch ", err);
        setLoginError(true);
        // TODO: use snackbar for error msg
        setLoading(false);
      });
  };

  // if (!auth) return <LoadingView />;

  return (
    <>

      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        {/* <SnackbarMsg
            open={isLoginError}
            message={"OTP is not correct."}
            severity="error"
          /> */}
        <Grid
          item
          xs={false}
          sm={5}
          md={8}
        />
        <Grid item xs={12} sm={6} md={4} component={Paper} elevation={7} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            

            <Typography
              component="h5"
              variant="h5"
              style={{
                fontSize: 15,
                marginTop: "1em",
                fontWeight: "600",
              }}
            >
              {!showOtpView ? "Sign in" : "OTP Verification"}
            </Typography>
            <Box sx={{ mt: 5, my: 8, minWidth: 300 }}>
              <div style={{ display: !showOtpView ? "block" : "none" }}>
                <TextField
                  id="phone"
                  label="Phone"
                  fullWidth
                  placeholder="1234567890"
                  variant="outlined"
                  onChange={(e) => setnumber(e.target.value.trim())}
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+91</InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ mt: 2 }}>
                  <div id="recaptcha-container"></div>
                </Box>
                <Button
                  loading={loading}
                  type="submit"
                  sx={{ mt: 4, mb: 2 }}
                  onClick={signin}
                >
                  Get Otp
                </Button>
              </div>

              <div style={{ display: showOtpView ? "block" : "none" }}>
                <TextField
                  id="otp"
                  label="OTP"
                  fullWidth
                  placeholder="Enter your OTP"
                  variant="outlined"
                  onChange={(e) => {
                    setotp(e.target.value);
                    setLoginError(false);
                  }}
                />

                <Button
                  loading={loading}
                  type="submit"
                  sx={{ mt: 4, mb: 2 }}
                  onClick={validateOtp}
                >
                  Verify & Proceed
                </Button>
              </div>
              <Grid justifyContent="center" sx={{ mt: 6 }}>
                <Grid item>
                  <Link
                    href="/signup"
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    {"Don't have an account?"}
                    <>&nbsp;</>{" "}
                    <span style={{ fontWeight: "bold" }}>Sign Up</span>
                  </Link>
                </Grid>
              </Grid>
              {/* <CopyrightFooter sx={{ mt: 15 }} /> */}
            </Box>
          </Box>
        </Grid>
        {optVerified && <Navigate to="/home" />}
      </Grid>
    </>
  );
}
