import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LanguageIcon from "@mui/icons-material/Language";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Visibility from "@mui/icons-material/Visibility";
import Edit from "@mui/icons-material/Edit";
import Close from "@mui/icons-material/Close";
import useMediaQuery from '@mui/material/useMediaQuery';
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSelector, useDispatch } from 'react-redux';
import InstagramIcon from "@mui/icons-material/Instagram";
import { db, storage } from "../firebaseConfig";
// import templatesMap from "../PdfTemplates/templateList.js";
import EditCancellationView from "../PackageBuilder/editCancellationPolicy.js";
import EditExclusions from "./editExclusions.js";
import { setUserData } from '../PackageBuilder/packBuilderSlice.js';
import SelectTemplate from "./selectTemplate.js";
// import EditCancellationPolicy from "../PackageBuilder/editCancellationPolicy.js";
import { isEmptyObject } from "../Utility.js";
import SnackbarMsg from "../Commons/snackbarMsg";
import InputAdornment from "@mui/material/InputAdornment";  // import necessary functions from Realtime Database SDK
import { rtdb } from "../firebaseConfig"; // Import the Firebase Realtime Database


const Profile = () => {
  // const user = JSON.parse(localStorage.getItem("user"));
  const userDataStore = useSelector((state) => state.packBuilderData.userData) || null;
  const [editedData, setEditedData] = useState({});
  // const [brandData, setBrandData] = useState({});
  const [isEdited, setIsEdited] = useState(false);
  const [isBrandEdited, setIsBrandEdited] = useState(false);
  const [viewFile, setViewFile] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [destinationInput, setDestinationInput] = useState("");
  const [showSnackbar, setShowSnackbar] = useState({open: false});
  const userProfileData = useSelector((state) => state.packBuilderData.userProfileData) || null;
  const userData = JSON.parse(localStorage.getItem('user'));
  const userPhone = userData.phone;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const dispatch = useDispatch();


  const {
    companyInfo= {},
    companyName = '',
    name = '',
    phone = '',
    email = '',
    address = '',
    paymentDetails = {},
    socialMediaDetails={}
  } = editedData;

  const { companyLogo = '' } = companyInfo;
  console.log("profile logo", paymentDetails);  //, userData, companyLogo, editedData

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "userDetails", userPhone);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // setUserData(data);
        setEditedData(data);
        console.log("get user ", data)
        dispatch(setUserData({ ...data }));
        setDestinations(data.destinations || []); 
      } else {
        alert("No user data found!");
      }
    };

 fetchData();
  }, [userPhone]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
    setIsEdited(true);
  };

  const uploadFileToStorage = async (file, path) => {
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const filePath = `/userDocs/${userPhone}/companyLogo`;
      const downloadURL = await uploadFileToStorage(file, filePath);
      const finalData = {
        ...editedData,
        companyInfo: { ...editedData.companyInfo, companyLogo: downloadURL },
      }
      setEditedData(finalData);
      setIsEdited(true);
      console.log("user logo local update", finalData);
      localStorage.setItem("user", JSON.stringify({ ...userData, companyInfo: { ...editedData.companyInfo, companyLogo: downloadURL } }));
    }
  };

  const handleFileChange = async (key, e) => {
    const file = e.target.files[0];
    if (file) {
      const filePath = `/userDocs/${userPhone}/${key}`;
      const downloadURL = await uploadFileToStorage(file, filePath);
      setEditedData({
        ...editedData,
        companyInfo: { ...editedData.companyInfo, [key]: downloadURL },
      });
      setIsEdited(true);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEdited(false);
  };

  const handleSocialMediaChange = (key, value) => {
    if (!key) return;
    let socialData = editedData?.socialMediaDetails;
    if (!socialData) socialData = {};
    else socialData = { ...editedData?.socialMediaDetails };
    socialData[key] = value;
    setEditedData({
        ...editedData,
        socialMediaDetails: socialData,
    });
    setIsEdited(true);
};

  const handleUpdate = async () => {
    const userDocRef = doc(db, "userDetails", userPhone);
    try {
      await updateDoc(userDocRef, { ...editedData, destinations });
      localStorage.setItem("user", JSON.stringify({ ...editedData, destinations }));
      // alert("Profile updated successfully!");
      setShowSnackbar({open: true, message: 'Profile updated successfully!', severity: 'success', });
      // window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      // alert("Failed to update profile.");
      setShowSnackbar({open: true, message: 'Failed to update profile! Please refresh and try again', severity: 'error', });
    }
  };

  const handleBrandUpdate = async () => {
    console.log("update BrandUpdate", userProfileData, userDataStore?.templateName);
    if(!userDataStore || isEmptyObject(userDataStore)) return;
    const userProfileDocRef = doc(db, "userProfileData", userPhone);
    const userDocRef = doc(db, "userDetails", userPhone);
    try {
      if(userProfileData || !isEmptyObject(userProfileData)) await setDoc(userProfileDocRef, userProfileData, { merge: true });
      await setDoc(userDocRef, {
        ...editedData,
        templateName: userDataStore?.templateName
      },
      { merge: true });
      localStorage.setItem("user", JSON.stringify({ ...editedData, templateName: userDataStore?.templateName }));
      // alert("Brand data updated successfully!");
      setShowSnackbar({open: true, message: 'Brand data updated successfully!', severity: 'success' });
      // window.location.reload();
    } catch (error) {
      console.log("Error updating Brand data:", error);
      // alert("Failed to update Brand data.");
      setShowSnackbar({open: true, message: 'Brand data updated Error! Please refresh and try again.', severity: 'error' });
    }
  };

  const handleDestinationAdd = () => {
    if (destinationInput.trim()) {
      setDestinations([...destinations, destinationInput]);
      setDestinationInput("");
      setIsEdited(true);
    }
  };

  const handleDestinationRemove = (index) => {
    const updatedDestinations = destinations.filter((_, i) => i !== index);
    setDestinations(updatedDestinations);
    setIsEdited(true);
  };

  const handlePayDetailsChange = (type, value) => {
    if(!type) return;
    let payData = editedData?.paymentDetails;
    if(!payData) payData = {};
    else payData = { ...editedData?.paymentDetails }
    payData[type] = value;
    setEditedData({ 
      ...editedData, 
      "paymentDetails": payData
    })
    setIsEdited(true);
  }

  if (!userData) return <Typography>Loading...</Typography>;

  return (<Box display={'flex'} flexDirection={isMobile ? 'column' : 'row'}>
    <Container maxWidth="md" sx={{ marginTop: isMobile ? 1 : 2 }}>
      <Paper elevation={0} sx={{ padding: 2, border: "1px solid #ddd" }}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography variant="h5" sx={{ marginBottom: 1 }}>
            Profile Details
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Button size="small" color="error" onClick={handleCancel} sx={{ margin: 'auto' }}>
              Cancel
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              disabled={!isEdited}
              sx={{ margin: 'auto' }}
            >
              Update
            </Button>
        </Box>
        </Box>

        <Box display="flex" alignItems="center" sx={{ marginBottom: 4 }}>
          <Box sx={{ position: "relative", marginRight: 3 }}>
            <Avatar
              src={companyLogo}
              alt="Company Logo"
              sx={{ width: 120, height: 120 }}
            />
            <IconButton
              color="secondary"
              component="label"
              sx={{ position: "absolute", bottom: -10, right: -10 }}
            >
              <Edit />
              <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
            </IconButton>
          </Box>
          <Box flex={1}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={companyName}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={name}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={email}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={phone}
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={address}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Payment Details:
        </Typography>
        <Grid container spacing={2} sx={{ marginTop: 0 }}>
          {
            paymentDetails?.accName && (<Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank Account Name"
                name="accName"
                value={paymentDetails?.accName || ''}
                onChange={(e) => handlePayDetailsChange("accName", e.target.value)}
                variant="outlined"
              />
            </Grid>)
          }
          {
            paymentDetails?.accNo && (<Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank Account No:"
                name="accNo"
                value={paymentDetails?.accNo}
                onChange={(e) => handlePayDetailsChange("accNo", e.target.value)}
                variant="outlined"
              />
            </Grid>)
          }
          {
            paymentDetails?.ifscCode && (<Grid item xs={12}>
              <TextField
                fullWidth
                label="Bank IFSC code:"
                name="ifscCode"
                value={paymentDetails?.ifscCode}
                onChange={(e) => handlePayDetailsChange("ifscCode", e.target.value)}
                variant="outlined"
              />
            </Grid>)
          }
          {
            paymentDetails?.upiId && (<Grid item xs={12}>
              <TextField
                fullWidth
                label="UPI Id:"
                name="upiId"
                value={paymentDetails?.upiId}
                onChange={(e) => handlePayDetailsChange("upiId", e.target.value)}
                variant="outlined"
              />
            </Grid>)
          }
        </Grid>

        <Typography variant="h6" sx={{ marginTop: 4 }}>
          Social Media Details:
        </Typography>
<Grid container spacing={2} sx={{ marginTop: 0 }}>
  <Grid item xs={12} sm={6}>
    <TextField
    fullWidth
    label="Instagram Profile URL"
    name="instagram"
    value={socialMediaDetails?.instagram || ''}
    onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
    variant="outlined"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <InstagramIcon />
        </InputAdornment>
      ),
    }}
  />
  </Grid>
  <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    label="LinkedIn Profile URL"
    name="linkedin"
    value={socialMediaDetails?.linkedin || ''}
    onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
    variant="outlined"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <LinkedInIcon />
        </InputAdornment>
      ),
    }}
  />
</Grid>
  <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    label="WhatsApp Number"
    name="whatsapp"
    value={socialMediaDetails?.whatsapp || ''}
    onChange={(e) => handleSocialMediaChange("whatsapp", e.target.value)}
    variant="outlined"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <WhatsAppIcon />
        </InputAdornment>
      ),
    }}
  />
</Grid>
  <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    label="Website URL"
    name="website"
    value={socialMediaDetails?.website || ''}
    onChange={(e) => handleSocialMediaChange("website", e.target.value)}
    variant="outlined"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <LanguageIcon />
        </InputAdornment>
      ),
    }}
  />
</Grid>
</Grid>
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Your Destinations
        </Typography>
        <Box display="flex" gap={2} sx={{ marginTop: 1, marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Add Destination"
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
            variant="outlined"
          />
          <Button variant="contained" color="primary" onClick={handleDestinationAdd}>
            Add
          </Button>
        </Box>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {destinations.map((destination, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                background: "#f5f5f5",
                borderRadius: 2,
                border: "1px solid #ddd",
              }}
            >
              <Typography variant="caption">{destination}</Typography>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDestinationRemove(index)}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Company Information
        </Typography>
        <Grid container spacing={2} sx={{ marginTop: 0 }}>
          {["businessDocs", "gst", "panCard"].map((key) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="caption" sx={{ marginBottom: 1 }}>
                  {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                </Typography>
                <Box
                  component="img"
                  src={companyInfo[key]}
                  alt={key}
                  sx={{ width: 80, height: 80, objectFit: "cover", border: "1px solid #ddd" }}
                />
                <Box display="flex" gap={1} mt={1}>
                  <IconButton
                    color="primary"
                    onClick={() => setViewFile(companyInfo[key])}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton color="secondary" component="label">
                    <Edit />
                    <input
                      type="file"
                      hidden
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(key, e)}
                    />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

      </Paper>
      <Dialog open={!!viewFile} onClose={() => setViewFile(null)} maxWidth="md">
        <DialogTitle>View File</DialogTitle>
        <DialogContent>
          {viewFile && (
            <Box
              component="img"
              src={viewFile}
              alt="Viewed File"
              sx={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
    <Container maxWidth="lg" sx={{ marginTop: isMobile ? 1 : 2 }}>
      <Paper elevation={0} sx={{ padding: 2, border: "1px solid #ddd" }}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography variant="h5" sx={{ marginBottom: 1 }}>
            Brand Details
          </Typography>
          <Box display="flex" justifyContent="flex-end" >
            <Button size="small" variant="text" color="error" onClick={handleCancel} sx={{ margin: 'auto' }}>
              Cancel
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleBrandUpdate}
              sx={{ margin: 'auto' }}
              disabled={!isBrandEdited}
            >
              Update
            </Button>
          </Box>
        </Box>

        {/* <Box display="flex" flex={1} alignItems="center" sx={{ marginBottom: 4 }}>
          {
            Object.keys(templatesMap).map((t, ti) => {
              return (<Box sx={{ position: "relative", marginRight: 3 }}>
                <Box
                  component="img"
                  src={"/Kerala2.png"}
                  alt={"kerala template"}
                  sx={{ width: 120, height: 120, objectFit: "cover", border: "1px solid #ddd" }}
                />
              </Box>)
            })
          }
        </Box> */}
        <SelectTemplate setIsBrandEdited={setIsBrandEdited} />
        
        {/* <Box display="flex" alignItems="center" sx={{ marginBottom: 4 }}>
        </Box> */}
        <EditCancellationView setIsBrandEdited={setIsBrandEdited} />

        <EditExclusions setIsBrandEdited={setIsBrandEdited} />
          

        {/* <Box display="flex" justifyContent="flex-end" sx={{ marginTop: 2 }}>
          <Button variant="contained" color="error" onClick={handleCancel} sx={{ marginRight: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBrandUpdate}
            // disabled={!isEdited}
          >
            Update
          </Button>
        </Box> */}


        {/* <Box>
          <Box flex={1}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={companyName}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={name}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={email}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={phone}
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={address}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ marginTop: 4 }}>
          Destinations
        </Typography>
        <Box display="flex" gap={2} sx={{ marginTop: 2, marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Add Destination"
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
            variant="outlined"
          />
          <Button variant="contained" color="primary" onClick={handleDestinationAdd}>
            Add
          </Button>
        </Box>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {destinations.map((destination, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                background: "#f5f5f5",
                borderRadius: 2,
                border: "1px solid #ddd",
              }}
            >
              <Typography>{destination}</Typography>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDestinationRemove(index)}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Typography variant="h6" sx={{ marginTop: 4 }}>
          Company Information
        </Typography>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {["businessDocs", "gst", "panCard"].map((key) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                </Typography>
                <Box
                  component="img"
                  src={companyInfo[key]}
                  alt={key}
                  sx={{ width: 120, height: 120, objectFit: "cover", border: "1px solid #ddd" }}
                />
                <Box display="flex" gap={1} mt={1}>
                  <IconButton
                    color="primary"
                    onClick={() => setViewFile(companyInfo[key])}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton color="secondary" component="label">
                    <Edit />
                    <input
                      type="file"
                      hidden
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(key, e)}
                    />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" justifyContent="flex-end" sx={{ marginTop: 4 }}>
          <Button variant="contained" color="error" onClick={handleCancel} sx={{ marginRight: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={!isEdited}
          >
            Update
          </Button>
        </Box> */}
      </Paper>
    </Container>
    {showSnackbar && (
      <SnackbarMsg
        open={showSnackbar.open}
        message={showSnackbar.message}
        anchorOrigin={showSnackbar.anchorOrigin}
        severity={showSnackbar.severity || "success"}
        onClose={() => setShowSnackbar({ open: false })}
      />
    )}
  </Box>);
};

export default Profile;
