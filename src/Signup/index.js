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
import { db, storage } from "../firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { nanoid } from "@reduxjs/toolkit";
import LoadingButton from "../Commons/LoadingButton";
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


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
    const fileRef = ref(storage, `userDocs/${personalInfo.phone}/${fileName}`);
    // ->  userDocs/phone/fileName
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {

    if(!personalInfo.name || !personalInfo.phone || !personalInfo.companyName || !personalInfo.address || !personalInfo.email || !personalInfo.companyLogo || !personalInfo.businessDocs || !personalInfo.panCard){
      setMissingInput(true);
      return;
    }

    setLoading(true);

    const uploadPromises = [
      companyInfo.companyLogo ? handleFileUpload(companyInfo.companyLogo, "companyLogo") : null,
      companyInfo.businessDocs ? handleFileUpload(companyInfo.businessDocs, "businessDocs") : null,
      companyInfo.panCard ? handleFileUpload(companyInfo.panCard, "panCard") : null,
      companyInfo.gst ? handleFileUpload(companyInfo.gst, "gst") : null,
    ];

    const [companyLogoUrl, businessDocsUrl, panCardUrl, gstUrl] = await Promise.all(uploadPromises);

    const formData = {
      ...personalInfo,
      companyInfo: {
        companyLogo: companyLogoUrl,
        businessDocs: businessDocsUrl,
        panCard: panCardUrl,
        gst: gstUrl,
      },
      // others,
      "phone": `+91${personalInfo.phone}`,
      "createdAt": Date.now(),
      userId: `U-${nanoid()}`
    };

    let docRef = doc(db, "userDetails", `+91${personalInfo.phone}`)
    await setDoc(docRef, formData);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
    // alert("Form submitted successfully!");
  };

  return (
    <Container maxWidth="sm">
      <CssBaseline />
      <Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="90vh"
          paddingX={3}
          borderRadius={2}
          boxShadow={3}
          bgcolor="#f9f9f9"
          marginTop={3}
        >

          <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: "20px", textAlign: "center" }} >Sign Up</Typography>
          {currentStep === 1 && (
            <Box width="100%">
              <Typography variant="h5" align="center" gutterBottom>
                Personal Info
              </Typography>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                required
              />

              <TextField
                label="Company Name"
                fullWidth
                margin="normal"
                value={personalInfo.companyName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, companyName: e.target.value })}
                required
              />
              <TextField
                label="Phone"
                fullWidth
                margin="normal"
                value={personalInfo.phone}
                onChange={(e) => {
                  const phone = e.target.value;
                  setPersonalInfo({ ...personalInfo, "phone": `+91${phone}` });
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
              />
              <TextField
                label="Address"
                fullWidth
                margin="normal"
                value={personalInfo.address}
                onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                required
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
              <Typography variant="h5" align="center" gutterBottom >
                Company Info
              </Typography>

              <Typography sx={{ marginTop: "20px" }}>Add Logo*</Typography>
              <Button
                variant="contained"
                component="label"
                sx={{ width: "100%" }}
              >

                <input
                  type="file"
                  onChange={(e) => setCompanyInfo({ ...companyInfo, companyLogo: e.target.files[0] })}
                  required
                />
              </Button>

              <Typography sx={{ marginTop: "20px" }}>Attach Business Registration Documents*</Typography>
              <Button
                variant="contained"
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
                component="label"
                sx={{ width: "100%" }}
              >
                <input
                  type="file"
                  onChange={(e) => setCompanyInfo({ ...companyInfo, gst: e.target.files[0] })}
                />
              </Button>
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
          <Box mt={3} display="flex" justifyContent="space-between" width="100%">
            <Button onClick={handleBack} disabled={currentStep === 1}>
              Back
            </Button>
            {currentStep < 2 ? (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <div>
                <LoadingButton loading={loading} variant="contained" color="primary" onClick={handleSubmit}>
                  SignUp
                </LoadingButton>
                {missingInput &&
                <Alert severity="error">Fill all the required data.</Alert>
                }
              </div>

            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;