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
import Link  from '@mui/material/Link';

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
    const url = "https://docs.google.com/spreadsheets/d/1isrnm1tjqj-IPzRgSBBPMQ1OBym4b-Bxwk6QoM7HE6U/edit?gid=0#gid=0 "; 


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRatesheet((prevRatesheet) => ({ ...prevRatesheet, [name]: value }));
    };

    const handleUploadRatesheet = async () => {
        setLoading(true);
        const fileRef = ref(storage, `userRateSheets/${userId}`);
        await uploadBytes(fileRef, ratesheet.ratesheetRef);
        const downloadURL = await getDownloadURL(fileRef);
        setRatesheet((prevRatesheet) => ({ ...prevRatesheet, ratesheetRef: downloadURL }));
        setLoading(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        let docRef = doc(db, "userDetails", `+91${userId}`);
        await updateDoc(docRef, {
            "companyInfo.rateSheet": ratesheet,
        });
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>Upload Ratesheet</Typography>
            </Box>

            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: "90vh",
                padding: 2,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: "#f9f9f9"
            }}>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Destination*"
                        name="destination"
                        value={ratesheet.destination}
                        onChange={handleInputChange}
                        fullWidth
                        size="small"
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        label="Hotel Name*"
                        name="hotelName"
                        value={ratesheet.hotelName}
                        onChange={handleInputChange}
                        fullWidth
                        size="small"
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: "17px" }}>
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
                            />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: "17px", marginBottom: "5px" }}>Upload your RateSheet here:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ border: "1px solid #ccc", padding: "5px", borderRadius: 2 }}>
                            <input
                                type="file"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={(event) => {
                                    setRatesheet((prevRatesheet) => ({ ...prevRatesheet, ratesheetRef: event.target.files[0] }));
                                }}
                                style={{ width: '100%' }}
                            />
                        </Box>
                        <Button variant="contained" size="small" color="primary" onClick={handleUploadRatesheet}>
                            {loading ? 'Uploading...' : 'Upload Ratesheet'}
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: "center", flexWrap: 'wrap', gap: 1 }}>
                        <Typography>⚫ To Download RateSheet Template</Typography>
                        <Link href={url} target="_blank">
                            <Button variant="outlined" size="small" color="primary">
                                Click here
                            </Button>
                        </Link>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
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