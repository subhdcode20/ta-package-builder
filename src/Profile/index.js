import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebaseConfig";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userPhone = user.phone;
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isEdited, setIsEdited] = useState(false);
  const [viewFile, setViewFile] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [destinationInput, setDestinationInput] = useState("");

  const {
    comapnyInfo= {},
    companyName = '',
    name = '',
    phone = '',
    email = '',
    address = '',
  } = editedData;

  const { companyLogo = '' } = comapnyInfo;

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "userDetails", userPhone);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setEditedData(data);
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
      setEditedData({
        ...editedData,
        comapnyInfo: { ...editedData.comapnyInfo, companyLogo: downloadURL },
      });
      setIsEdited(true);
    }
  };

  const handleFileChange = async (key, e) => {
    const file = e.target.files[0];
    if (file) {
      const filePath = `/userDocs/${userPhone}/${key}`;
      const downloadURL = await uploadFileToStorage(file, filePath);
      setEditedData({
        ...editedData,
        comapnyInfo: { ...editedData.comapnyInfo, [key]: downloadURL },
      });
      setIsEdited(true);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEdited(false);
  };

  const handleUpdate = async () => {
    const userDocRef = doc(db, "userDetails", userPhone);
    try {
      await updateDoc(userDocRef, { ...editedData, destinations });
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
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

  if (!userData) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Paper elevation={0} sx={{ padding: 4, border: "1px solid #ddd" }}>
        <Typography variant="h4" sx={{ marginBottom: 4 }}>
          Profile Details
        </Typography>

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
                  src={comapnyInfo[key]}
                  alt={key}
                  sx={{ width: 120, height: 120, objectFit: "cover", border: "1px solid #ddd" }}
                />
                <Box display="flex" gap={1} mt={1}>
                  <IconButton
                    color="primary"
                    onClick={() => setViewFile(comapnyInfo[key])}
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
        </Box>
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
  );
};

export default Profile;
