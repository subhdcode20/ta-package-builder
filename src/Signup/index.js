import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, setDoc } from "firebase/firestore";
import { nanoid } from "@reduxjs/toolkit";
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db, storage } from "../firebaseConfig";
import LoadingButton from "../Commons/LoadingButton";
import { fileToBase64 } from "../Utility.js";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [missingInput, setMissingInput] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    phone: "",
    email: "",
    name: "",
    companyName: "",
    address: "",
  });
  const [companyInfo, setCompanyInfo] = useState({
    companyLogo: null,
    businessDocs: null,
    panCard: null,
    gst: null,
  });
  // const [others, setOthers] = useState({
  //   uploadRateSheet: false,
  //   enterPriceManually: false,
  // });

  const [errors, setErrors] = useState({
    phone: "",
    email: "",
  });

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleFileUpload = async (file, fileName) => {
    const fileRef = ref(storage, `userDocs/+91${personalInfo.phone}/${fileName}`);
    // ->  userDocs/phone/fileName
    await uploadBytes(fileRef, file);
    // if(fileName == "companyLogo") {
    //   await handleSavePdfData(file);
    // }
    return await getDownloadURL(fileRef);
  };

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    console.log("signup submit ", personalInfo, companyInfo)
    if (!personalInfo.name || !personalInfo.phone || !personalInfo.address || !personalInfo.email ||
      !companyInfo.companyLogo || !companyInfo.companyName) {
      setMissingInput(true);
      return;
    }
    setLoading(true);
    try {
      const uploadPromises = [
        companyInfo.companyLogo ? handleFileUpload(companyInfo.companyLogo, "companyLogo") : null,
        // companyInfo.businessDocs ? handleFileUpload(companyInfo.businessDocs, "businessDocs") : null,
        // companyInfo.panCard ? handleFileUpload(companyInfo.panCard, "panCard") : null,
        // companyInfo.gst ? handleFileUpload(companyInfo.gst, "gst") : null,
      ];

      const [companyLogoUrl] = await Promise.all(uploadPromises);
      // , businessDocsUrl, panCardUrl, gstUrl

      const formData = {
        ...personalInfo,
        companyInfo: {
          ...companyInfo,
          companyLogo: companyLogoUrl,
          // businessDocs: businessDocsUrl,
          // panCard: panCardUrl,
          // gst: gstUrl,
        },
        // others,
        "phone": `+91${personalInfo.phone}`,
        "createdAt": Date.now(),
        status: 'active',
        userId: `U-${nanoid()}`
      };

      let docRef = doc(db, "userDetails", `+91${personalInfo.phone}`)
      await setDoc(docRef, formData);
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 1000);
      // alert("Form submitted successfully!");
    } catch (error) {
      console.log("signup error", error);
      setLoading(false);
    }
  };

    // const handleSavePdfData = async (companyLogo) => {
    //   console.log("fileB64 initial", personalInfo.phone, companyLogo, typeof companyLogo);
    //   // setCompanyInfo({ ...companyInfo, companyLogo });
    //   let fileB64 = await fileToBase64(companyLogo);
    //   console.log("fileB64 ", fileB64, companyLogo);
    //   let docRef = doc(db, "userPdfData", `+91${personalInfo.phone}`)
    //   await setDoc(docRef, {
    //     logoB64Str: fileB64
    //   }, { merge: true });
    // }

  console.log("signup render ", personalInfo, companyInfo);
  return (
    <Container maxWidth="sm">
      <CssBaseline />
      <Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-around"
          alignItems="center"
          minHeight="60vh"
          paddingX={3}
          border={'1px solid'}
          borderColor={'secondary'}
          borderRadius={2}
          marginTop={2}
        >
          {/* <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
            <img src="/logo.jpg" style={{margin: 'auto', width: '150px'}} />
          </div> */}
          <Typography variant="h4" sx={{ fontWeight: 600, my: 1, textAlign: "center" }} >Sign Up</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: 1, textAlign: "center" }} >We will contact for a Demo</Typography>
          {currentStep === 1 && (
            <Box width="100%">
              <Typography variant="body1" align="center" gutterBottom>
                Personal Info
              </Typography>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                required
                size="small"
              />

              {/* <TextField
                label="Company Name"
                fullWidth
                margin="normal"
                value={personalInfo.companyName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, companyName: e.target.value })}
                required
                size="small"
              /> */}
              <TextField
                label="Phone"
                fullWidth
                margin="normal"
                value={personalInfo.phone}
                onChange={(e) => {
                  const phone = e.target.value;
                  setPersonalInfo({ ...personalInfo, "phone": phone });
                  if (!validatePhone(phone)) {
                    setErrors({ ...errors, phone: "Invalid phone number (10 digits required)" });
                  } else {
                    setErrors({ ...errors, phone: "" });
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+91</InputAdornment>
                  ),
                }}
                error={!!errors.phone}
                helperText={errors.phone}
                required
                size="small"
              />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={personalInfo.email}
                onChange={(e) => {
                  const email = e.target.value;
                  setPersonalInfo({ ...personalInfo, email });
                  if (!validateEmail(email)) {
                    setErrors({ ...errors, email: "Invalid email address" });
                  } else {
                    setErrors({ ...errors, email: "" });
                  }
                }}
                error={!!errors.email}
                helperText={errors.email}
                required
                size="small"
              />
              <TextField
                label="Address"
                fullWidth
                margin="normal"
                value={personalInfo.address}
                onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                required
                size="small"
              />
            </Box>
          )}
          {currentStep === 2 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                // alignItems: "center",
                padding: 3,
              }}
            >
              <Typography variant="body1" align="center" gutterBottom >
                Company Info
              </Typography>

              <TextField
                label="Company Name"
                fullWidth
                margin="normal"
                value={companyInfo.companyName}
                onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                required
                size="small"
              />
              <Typography sx={{ marginTop: "20px" }}>Add Logo* (only PNG!)</Typography>
              <Button
                variant="contained"
                size="small"
                component="label"
                sx={{ width: "100%" }}
              >
                <input
                  type="file"
                  onChange={(e) => setCompanyInfo({ ...companyInfo, companyLogo: e.target.files[0] })}
                  required
                />
              </Button>

              {/* <Typography sx={{ marginTop: "20px" }}>Attach Business Registration Documents*</Typography>
              <Button
                variant="contained"
                size="small"
                component="label"
                sx={{ width: "100%" }}
              >
                <input
                  type="file"
                  onChange={(e) => setCompanyInfo({ ...companyInfo, businessDocs: e.target.files[0] })}
                  required
                />
              </Button>

              <Typography sx={{ marginTop: "20px" }}>Add PAN Card*</Typography>
              <Button
                variant="contained"
                size="small"
                component="label"
                sx={{ width: "100%" }}
              >
                <input
                  type="file"
                  onChange={(e) => setCompanyInfo({ ...companyInfo, panCard: e.target.files[0] })}
                  required
                />
              </Button>

              <Typography sx={{ marginTop: "20px" }}>GST (If Applicable)</Typography>
              <Button
                variant="contained"
                size="small"
                component="label"
                sx={{ width: "100%" }}
              >
                <input
                  type="file"
                  onChange={(e) => setCompanyInfo({ ...companyInfo, gst: e.target.files[0] })}
                />
              </Button> */}
            </Box>

          )}
          {/* {currentStep === 3 && (
          <Box width="100%" >
            <Typography variant="h4" align="center" gutterBottom>
              Others
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,

              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={others.uploadRateSheet}
                    onChange={(e) => setOthers({ ...others, uploadRateSheet: e.target.checked })}
                  />
                }
                label="Upload RateSheet"
              />
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={others.enterPriceManually}
                    onChange={(e) => setOthers({ ...others, enterPriceManually: e.target.checked })}
                  />
                }
                label="Enter Price Manually"
              />
            </Box>

          </Box>
        )} */}
          <Box mt={3} display="flex" justifyContent="space-between" width="100%" sx={{ mb: 1 }}>
            <Button onClick={handleBack} disabled={currentStep === 1}
              size="small">
              Back
            </Button>
            {currentStep < 2 ? (
              <Button variant="contained" color="primary" onClick={handleNext}
                size="small">
                Next
              </Button>
            ) : (
              <div>
                <LoadingButton loading={loading} variant="contained" color="primary" onClick={handleSubmit}
                  size="small">
                  SignUp
                </LoadingButton>
                {missingInput && <Alert severity="error">Fill all the required data.</Alert>}
              </div>

            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;