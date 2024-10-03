import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CssBaseline from "@mui/material/CssBaseline";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import PopUp from '../Commons/messagePopUp';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import LoadingButton from "../Commons/LoadingButton";
import InfoIcon from '@mui/icons-material/Info';

const UploadRatesheet = () => {
    const { userId } = useParams();
    const [ratesheet, setRatesheet] = useState({
        destination: '',
        hotelName: '',
        startDate: '',
        endDate: '',
        ratesheetRef: null,
    });
    const [loading, setLoading] = useState(false);
    const [submitMsg, setSubmitMsg] = useState(false);
    const [missingInput, setMissingInput] = useState(false);
    const url = "https://docs.google.com/spreadsheets/d/1isrnm1tjqj-IPzRgSBBPMQ1OBym4b-Bxwk6QoM7HE6U/edit?gid=0#gid=0 ";


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRatesheet((prevRatesheet) => ({ ...prevRatesheet, [name]: value }));
    };

    const handleUploadRatesheet = async (file) => {
        const fileRef = ref(storage, `userRateSheets/${userId}-${ratesheet.destination}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        setRatesheet((prevRatesheet) => ({ ...prevRatesheet, ratesheetRef: downloadURL }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleUploadRatesheet(file);
        }
    };


    const handleSubmit = async () => {

        if (!ratesheet.destination || !ratesheet.hotelName || !ratesheet.startDate || !ratesheet.endDate) {
            setMissingInput(true);
            return;
        }

        setLoading(true);

        // ==> TO CHANGE <==

        // let docRef = doc(db, "userHotels", `+91${userId}`); 
        // await updateDoc(docRef, {
        //     "companyInfo.rateSheet": ratesheet,
        // });
        console.log("Ratesheet ->", ratesheet);
        setLoading(false);
        setSubmitMsg(true);
    };
    const handleSubmitMsg = () => {
        setSubmitMsg(false);
    };
    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <CssBaseline />

            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: "90vh",
                padding: 2,
                borderRadius: 4, // Increased border radius
                border: "2px solid #ccc", // Added border
                bgcolor: "transparent" // Removed background color
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, mt: 0 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: "5px", marginTop: "0px" }}>
                        Upload Ratesheet
                    </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Destination"
                        name="destination"
                        value={ratesheet.destination}
                        onChange={handleInputChange}
                        fullWidth
                        size="small"
                        required
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        label="Hotel Name"
                        name="hotelName"
                        value={ratesheet.hotelName}
                        onChange={handleInputChange}
                        fullWidth
                        size="small"
                        required
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: "16px" }}>
                        Rate Sheet Validity*
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body1" sx={{ mr: 2 }}>
                                From
                            </Typography>
                            <TextField
                                type="date"
                                name="startDate"
                                value={ratesheet.startDate}
                                onChange={handleInputChange}
                                fullWidth
                                size="small"
                                required
                            />
                        </Box>
                        <Typography sx={{ mx: 1 }}>-</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body1" sx={{ mr: 2 }}>
                                To
                            </Typography>
                            <TextField
                                type="date"
                                name="endDate"
                                value={ratesheet.endDate}
                                onChange={handleInputChange}
                                fullWidth
                                size="small"
                                required
                            />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: "16px", marginBottom: "5px" }}>Upload your RateSheet here:</Typography>
                    <Button
                        variant="contained"
                        component="label"
                        sx={{ width: "50%" }}
                    >
                        <input
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={handleFileChange}
                            style={{ width: '100%' }}
                            required
                        />
                    </Button>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: "center", flexWrap: 'wrap', gap: 1 }}>
                        <Typography>
                            <InfoIcon color='primary' style={{ verticalAlign: 'middle', marginRight: "3px" }} />
                            To Download RateSheet Template
                        </Typography>
                        <Link href={url} target="_blank">
                            <Button variant="outlined" size="small" color="primary">
                                Click here
                            </Button>
                        </Link>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: 5, mb: 2 }}>
                    <LoadingButton loading={loading} variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </LoadingButton>
                    {missingInput && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            Fill all the required data.
                        </Alert>
                    )}
                </Box>
            </Box>

            <PopUp
                open={submitMsg}
                onClose={handleSubmitMsg}
                primaryText="Submission Successful"
                secondaryText="RateSheet will be activated within 1 Day"
                submitText="Close"
                onClick={handleSubmitMsg}
            />
        </Container>


    );
};

export default UploadRatesheet;