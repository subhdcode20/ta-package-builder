import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { doc, getDoc } from 'firebase/firestore';
import InfoRounded from '@mui/icons-material/InfoRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import LocationOn from '@mui/icons-material/LocationOn';
import Phone from '@mui/icons-material/Phone';

const PackagePdf = () => {
    const { packageId } = useParams();
    const [packageData, setPackageData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPackageData = async () => {
        let docRef = doc(db, "packages", packageId);
        let docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
            const data = docSnap.data();
            setPackageData([{
                createdAt: data.createdAt,
                userId: data.userId,
                packaged: data.packaged,
                hotels: data.hotels.map((hotel) => {
                    return {
                        destination: hotel.hotels[0].destination,
                        hotelName: hotel.hotels[0].hotelName,
                        roomRates: hotel.hotels[0].roomRates.family_suite,
                        roomName: hotel.hotels[0].roomRates.family_suite.roomName,
                        occupancy: hotel.hotels[0].roomRates.family_suite.occupancy,
                    };
                }),
            }]);
            setLoading(false);
        } else {
            console.log("No DAta available");
        }
    };
    useEffect(() => {
        fetchPackageData();
    }, [packageId]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    console.log("packageData => ", packageData);

    return (
        <Paper elevation={0} sx={{ padding: "10px" }}>
            <Box sx={{ marginBottom: 2 }}>
                <Typography variant="h5">Package Details</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', backgroundColor: "lightgrey" }}>
                <Box sx={{ margin: 'auto', }}>
                    <Box sx={{ width: "900px" }}>
                        {packageData.map((data, index) => (
                            <Box key={index} sx={{ padding: 2, border: '1px solid #ddd', backgroundColor: "white", margin: "10px", maxHeight: "600px", overflow: "scroll" }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6">Itinerary</Typography>
                                    <Box display="flex" alignItems="center">
                                        <Phone />
                                        <Typography>{data.userId}</Typography>
                                    </Box>
                                </Box>
                                {data.hotels.map((hotel, hotelIndex) => (
                                    <Box key={hotelIndex} sx={{ margin: '10px 0' }}>
                                        <Chip
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <InfoRounded sx={{ fill: '#b352d1' }} />
                                                    <Typography sx={{ marginLeft: '5px' }}>Day : {hotelIndex + 1}</Typography>
                                                </Box>
                                            }
                                            sx={{ backgroundColor: '' }}
                                        />
                                        <Box sx={{ padding: 2, border: '1px solid lightgrey', backgroundColor: "" }}>
                                            <Box sx={{ display: 'flex' }}>
                                                <img style={{ height: "150px", width: "250px", margin: "10px" }} src='https://cdn.sanity.io/images/ocl5w36p/production/d82b5f532cf2b62e7dc32ee6ddccd6d8af074cba-3840x1860.jpg' />
                                                <Box sx={{ marginLeft: '20px' }}>
                                                    <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>{hotel.hotelName}</Typography>
                                                    <Typography sx={{ fontSize: "18px", fontWeight: 500 }}>{hotel.roomName}</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: "flex", justifyContent: "space-around", marginTop: '10px' }}>
                                                <Chip
                                                    sx={{ backgroundColor: '#effcff', textAlign: "center", borderRadius: "10px", boxShadow: "2px 2px 2px lightgrey", }}
                                                    label={
                                                        <div style={{ display: "flex", justifyContent: "center", gap: "5px", }}>
                                                            <PersonRounded />
                                                            <Typography> {hotel.occupancy.adults} adults, {hotel.occupancy.child} child</Typography>

                                                        </div>
                                                    }
                                                />
                                                <Chip
                                                    sx={{ backgroundColor: '#effcff', textAlign: "center", borderRadius: "10px", boxShadow: "2px 2px 2px lightgrey", }}
                                                    label={
                                                        <div style={{ display: "flex", justifyContent: "center", gap: "5px", }}>
                                                            <LocationOn />
                                                            <Typography>{hotel.destination}</Typography>
                                                        </div>
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default PackagePdf;