import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { nanoid } from "@reduxjs/toolkit";
import LoadingButton from "../Commons/LoadingButton";
import Alert from '@mui/material/Alert';

const initialFormData = {
  phone: "",
  name: "",
  email: "",
};

export default function SignUp() {
  const [signupFields, setSignupFields] = useState(initialFormData);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupAlert, setSignupAlert] = useState(false);
  const [correctNumber, setCorrectNumber] = useState(false);
  const [correctEmail, setCorrectEmail]  = useState(false);

  const navigate = useNavigate();

  const handleChange = (field, val) => {
    if (field === "phone") {
      let updatedNumber = val;
      if (updatedNumber === "" || updatedNumber.length < 10) {
        setCorrectNumber(true);
      }
      else {
        setCorrectNumber(false);
      }
    }
    if (field === "email") {
      let updatedEmail = val;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(updatedEmail)) {
        setCorrectEmail(true);
      } else {
        setCorrectEmail(false);
      }
    }
    let tempData = { ...signupFields };
    tempData[field] = val.trim();
    setSignupFields(tempData);
  };


  const handleSignup = async (event) => {
    event.preventDefault();
    setSignupLoading(true);
    let finalFormData = { ...signupFields };
    if (!finalFormData.phone || isNaN(finalFormData.phone) || finalFormData.phone.length !== 10) {
      setSignupAlert(true);
      setSignupLoading(false);
      return;
    }
    let finalPhone = `+91${finalFormData.phone}`;
    finalFormData["phone"] = finalPhone;
    finalFormData["createdAt"] = Date.now();
    finalFormData["userId"] = `U-${nanoid()}`;
    let docRef = doc(collection(db, "userDetails"), finalPhone);
    await setDoc(docRef, finalFormData);
    setTimeout(() => {
      setSignupLoading(false);
      navigate("/home");
    }, 1000);
  };

  return (
    <>

      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />

        <Grid />
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={7} square>
          <Box
            sx={{
              my: 2,
              mx: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h5"
              variant="h5"
              style={{
                fontSize: 17,
                marginTop: "1em",
                fontWeight: "600",
              }}
            >
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSignup}
              sx={{ mt: 3, px: 2 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="phone"
                    label="Phone"
                    fullWidth
                    placeholder="1234567890"
                    variant="outlined"
                    required
                    autoFocus
                    onChange={(e) => handleChange("phone", e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">+91 </InputAdornment>
                      ),
                    }}
                  />
                  {correctNumber && <Alert  severity="error">Number is not valid </Alert>}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="name"
                    name="Name"
                    required
                    fullWidth
                    id="name"
                    type="text"
                    label="Name"
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                {correctEmail && <Alert  severity="error">Please write a valid email </Alert>}

                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </Grid>

              </Grid>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <LoadingButton
                  loading={signupLoading}
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, width: "20em" }}
                >
                  Sign Up
                </LoadingButton>
                <Grid container sx={{ mt: 4 }} justifyContent="center">
                  <Grid item>
                    <Link href="/login" variant="body2" style={{ color: "#000" }}>
                      Already have an account?{" "}
                      <span style={{ fontWeight: "bold" }}>Log in</span>
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}