import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CssBaseline from "@mui/material/CssBaseline";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import InfoIcon from '@mui/icons-material/Info';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';

import { storage } from '../firebaseConfig';
import PopUp from '../Commons/messagePopUp';
import LoadingButton from "../Commons/LoadingButton";
import { MainContext } from "../Utility";
import ViewRatesSheets from "./viewActiveRatesheets.js";
// const userData = JSON.parse(localStorage.getItem("user"));

const bull = (<Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
>•</Box>)

const UploadRatesheet = () => {
    // const { userId } = useParams();
    const { phone: userId = '' } = JSON.parse(localStorage.getItem("user"));
    const [ratesheet, setRatesheet] = useState({
        destination: '',
        // hotelName: '',
        startDate: '',
        endDate: '',
        ratesheetUrl: null,
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitMsg, setSubmitMsg] = useState(false);
    const [missingInput, setMissingInput] = useState(false);
    const { userData={} } = useContext(MainContext);
    const firebaseIdToken = localStorage.getItem('afFirebaseIdToken');
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
    const url = "https://docs.google.com/spreadsheets/d/1isrnm1tjqj-IPzRgSBBPMQ1OBym4b-Bxwk6QoM7HE6U/edit?gid=0#gid=0";

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRatesheet((prevRatesheet) => ({ ...prevRatesheet, [name]: value }));
    };

    const handleUploadRatesheet = async (file) => {
        const fileRef = ref(storage, `userRateSheets/${userId}-${ratesheet.destination}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        setRatesheet((prevRatesheet) => ({ ...prevRatesheet, ratesheetUrl: downloadURL }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleUploadRatesheet(file);
        }
    };

    const handleSubmit = async () => {
        if (!ratesheet.destination || !ratesheet.startDate || !ratesheet.endDate) {
            setMissingInput(true);
            return;
        }
        setLoading(true);
        
        const axiosOptions = {
            method: 'POST',
            headers: { 
                // 'content-type': 'application/x-www-form-urlencoded',
                'Authorization': firebaseIdToken 
            },
            data: {
                validFrom: ratesheet.startDate,
                validUntil: ratesheet.endDate,
                fileUrl: ratesheet.ratesheetUrl
            },
            url: `${process.env.REACT_APP_API_DOMAIN}/destinations/${ratesheet.destination}/upload-rate-sheet/`,
        };
        console.log("Ratesheet ->", userData, firebaseIdToken, ratesheet, `${process.env.REACT_APP_API_DOMAIN}/destinations/${ratesheet.destination}/upload-rate-sheet/`, axiosOptions);

        let response = await axios(axiosOptions);
        console.log('response axios ', response);
        setLoading(false);
        setSubmitMsg(true);
    };

    const handleSubmitMsg = () => {
        setSubmitMsg(false);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <CssBaseline />
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                // minHeight: "90vh",
                padding: 2,
                borderRadius: 4,
                border: "1px solid #ccc",
                bgcolor: "transparent",
                paddingX: 3,
                alignItems: 'center'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '20px', marginTop:1 }}>
                        Upload Your Ratesheet
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mb: 3 }}>
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                        {bull} Submit your Rates for Hotels as an Excel sheet. We will auto calculate Hotel Prices as you select them!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                        {bull} Download the Ratesheet Template below and fill your data according to mentioned columns.
                    </Typography>
                    <Typography variant="body1" >
                        {bull} Submit it back here and you can start using it immediately.
                    </Typography>
                </Box>

                <Box sx={{ mb: 3, display: 'flex', alignItems: "center", gap: 1 }}>
                    <InfoIcon color='primary' fontSize="small" />
                    <Typography sx={{ fontSize: 13 }}>To Download RateSheet Template</Typography>
                    <Link href={url} target="_blank">
                        <Button variant="outlined" size="small">
                            Click here
                        </Button>
                    </Link>
                </Box>

                <Box sx={{ mb: 2, width: isMobile ? '100%' : '55%' }}>
                    <InputLabel sx={{ fontSize: 12 }}>Destination*</InputLabel>
                    <TextField
                        name="destination"
                        value={ratesheet.destination}
                        onChange={handleInputChange}
                        fullWidth
                        size="small"
                    />
                </Box>

                {/* <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontSize: 12 }}>Total Nights*</InputLabel>
                    <TextField
                        name="hotelName"
                        value={ratesheet.hotelName}
                        onChange={handleInputChange}
                        fullWidth
                        size="small"
                    />
                </Box> */}

                <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: "14px", fontWeight: 'bold' }}>
                        Rate Sheet Validity*
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap:'wrap' , alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ mr: 1, fontSize: 12 }}>
                                From
                            </Typography>
                            <TextField
                                type="date"
                                name="startDate"
                                value={ratesheet.startDate}
                                onChange={handleInputChange}
                                size="small"
                            />
                        </Box>
                        <Typography sx={{ mx: 1, fontSize: 12, width: isMobile ? '100%' : 'auto' }}>-</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ mr: 1, fontSize: 12 }}>
                                To
                            </Typography>
                            <TextField
                                type="date"
                                name="endDate"
                                value={ratesheet.endDate}
                                onChange={handleInputChange}
                                size="small"
                            />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mb: 3, width: isMobile ? '100%' : '55%' }}>
                    <Typography sx={{ fontSize: 12, marginBottom: "5px" }}>Upload your RateSheet here:</Typography>
                    <Button variant="contained" component="label" sx={{ width: "100%" }}>
                        <input
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={handleFileChange}
                            style={{ width: '100%' }}
                        />
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <LoadingButton
                        loading={loading}
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        size="small"
                    >
                        Submit
                    </LoadingButton>
                </Box>

                {missingInput && (
                    <Alert severity="error" sx={{ mt: 2, fontSize: 12 }}>
                        Please fill all the required fields.
                    </Alert>
                )}
            </Box>

            <Box>
                <ViewRatesSheets />
            </Box>

            <PopUp
                open={submitMsg}
                onClose={handleSubmitMsg}
                primaryText="Upload Successful"
                secondaryText={`Create a package for ${ratesheet?.Bali || "this destination"} to auto calculate Prices!`}
                submitText="Close"
                onClick={handleSubmitMsg}
            />
        </Container>
    );
};

export default UploadRatesheet;
