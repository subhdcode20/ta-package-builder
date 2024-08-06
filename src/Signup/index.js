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
// import { collection, doc, setDoc } from "firebase/firestore";
// import { nanoid } from "nanoid";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet";

// import LoadingButton from "../Commons/LoadingButton";
// import CopyrightFooter from "../Commons/copyright-footer";
// import SnackbarMsg from "../Commons/snackbarMsg";
// import {
//   DestinationNames,
//   KYC_PENDING_LINK,
//   WHATSAPP_FORUM_LINK_AGENT,
//   WHATSAPP_FORUM_LINK_SUPPLIER,
// } from "../Constants";
// import { AutocompleteInput, isEmptyObject, sendEmail } from "../Utility";
import { db } from "../firebaseConfig";

// const backgroundBanner = require("./signup_banner.png");

const initialFormData = {
  phone: "",
  name: "",
  email: "",
  isAgent: true,
  isSupplier: false,
  isAdmin: false,
  destinations: [],
  isKycVerified: false,
  kycDocs: [],
  status: "pending",
  otherServices: {},
};

// const MENU_ITEM_HEIGHT = 48;
// const MENU_ITEM_PADDING_TOP = 8;

// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: MENU_ITEM_HEIGHT * 4.5 + MENU_ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

export default function SignUp() {
  const [signupFields, setSignupFields] = useState(initialFormData);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupAlert, setSignupAlert] = useState(false);

  const navigate = useNavigate();

  const handleChange = (field, val) => {
    // console.log("signup handleChange ", field, val, isNaN(val), typeof val);
    // let tempData = { ...signupFields };
    // if (field === "userType") {
    //   tempData["isAgent"] = val === "agent";
    //   tempData["isSupplier"] = val === "supplier";
    // } else if (field === "destinations") {
    //   const destVals = typeof val === "string" ? val.split(",") : val;
    //   // let destData = {};
    //   // destVals.forEach((item, i) => {
    //   //   destData[item] = true;
    //   // });
    //   tempData[field] = destVals;
    // } else if (field === "phone") {
    //   console.log("signup phone ", val, isNaN(val));
    //   if (isNaN(val)) return;
    //   tempData[field] = val.trim();
    // } else tempData[field] = val.trim();
    // // tempData['isAgent'] = (val == 'supplier');
    // setSignupFields(tempData);
  };

  const handleSignup = async (event) => {
    // event.preventDefault();
    // setSignupLoading(true);
    // let finalFormData = { ...signupFields };
    // if (
    //   !signupFields.phone ||
    //   isNaN(signupFields.phone) ||
    //   !(signupFields.phone.length == 10) ||
    //   (userType === "supplier" && signupFields.destinations.length == 0)
    // ) {
    //   console.log(
    //     "validation sign up 1 ",
    //     !signupFields.phone,
    //     isNaN(signupFields.phone),
    //     !(signupFields.phone.length == 10),
    //     userType === "supplier" && signupFields.destinations.length == 0
    //   );
    //   setSignupAlert(true);
    //   setSignupLoading(false);
    //   return;
    // }
    // let finalPhone = `+91${signupFields.phone}`;
    // finalFormData["phone"] = finalPhone;
    // finalFormData["createdAt"] = Date.now();
    // finalFormData["userId"] = `U-${nanoid()}`;
    // if (!isEmptyObject(finalFormData["otherServices"])) {
    //   let finalOtherServies = Object.keys(
    //     finalFormData["otherServices"]
    //   ).filter((i) => finalFormData["otherServices"][i]);
    //   finalFormData["otherServices"] = finalOtherServies;
    // } else finalFormData["otherServices"] = [];
    // let agentRequiredFields = [
    //   finalPhone,
    //   finalFormData.name,
    //   finalFormData.email,
    // ];
    // let supplierRequiredFields = [
    //   finalPhone,
    //   finalFormData.name,
    //   finalFormData.email,
    //   finalFormData.destinations,
    // ];
    // const isValid = (
    //   userType === "supplier" ? supplierRequiredFields : agentRequiredFields
    // ).every((value) => value.length > 0);
    // console.log(
    //   "validation sign up 2",
    //   isValid,
    //   finalPhone,
    //   finalFormData.name,
    //   finalFormData.email,
    //   finalFormData.destinations
    // );

    // if (!isValid) {
    //   setSignupAlert(true);
    //   setSignupLoading(false);
    // } else {
    //   let docRef = doc(collection(db, "userDetails"), finalPhone);
    //   await setDoc(docRef, finalFormData);

    //   await sendEmail({
    //     to: finalFormData.email,
    //     name: finalFormData.name,
    //     template: {
    //       name: "welcome_signup",
    //       data: {
    //         name: finalFormData.name,
    //         kycLink: KYC_PENDING_LINK,
    //         whatsappForumLink:
    //           userType === "agent"
    //             ? WHATSAPP_FORUM_LINK_AGENT
    //             : WHATSAPP_FORUM_LINK_SUPPLIER,
    //       },
    //     },
    //   });
    //   await setTimeout(() => {
    //     setSignupLoading(false);
    //     if (userType === "agent") navigate("/post-req");
    //     else navigate("/kyc-pending");
    //   }, 1000);
    // }
  };

  const handleOtherServicesChange = (event) => {
    // let otherServices = {
    //   ...signupFields["otherServices"],
    //   [event.target.name]: event.target.checked,
    // };
    // let tempData = { ...signupFields };
    // tempData["otherServices"] = otherServices;
    // setSignupFields(tempData);
  };

  return (
    <>
      {/* <Helmet>
              <meta charSet="utf-8" />
              <title>Sign Up for Verified B2B Cab Quotes in 15 Minutes | CabEasy </title>
              <meta
                name="description"
                content="Get verified B2B cab quotes within 15 minutes from CabEasy for destinations including Himachal, Kashmir, Rajasthan, Kerala, Karnataka, Tamil Nadu, Uttarakhand (excluding Char Dham), and Andaman and Nicobar Islands. Visit cabeasy.in. Enjoy ₹200 off on your next booking if we miss the mark! (Terms apply: Requirements sent between 10am and 10pm only)."
              />
              <link rel="canonical" href="https://cabeasy.in/signup" />
            </Helmet> */}
    
      <Grid container component="main" sx={{ height: "100vh" }}>
        {/* <SnackbarMsg
                  open={signupAlert}
                  message={"Please fill the required information correctly."}
                  severity="error"
                /> */}
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
                textDecoration: "underline",
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
              <Button
                loading={signupLoading}
                type="submit"
                sx={{ mt: 3, mb: 2, width: "20em" }}
              >
                Sign Up
              </Button>

              <Grid container sx={{ mt: 4 }} justifyContent="center">
                <Grid item>
                  <Link href="/login" variant="body2" style={{ color: "#000" }}>
                    Already have an account?{" "}
                    <span style={{ fontWeight: "bold" }}>Log in</span>
                  </Link>
                </Grid>
              </Grid>
            </Box>
            {/* <CopyrightFooter sx={{ mt: 8 }} /> */}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
