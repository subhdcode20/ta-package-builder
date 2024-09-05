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
import PdfView from './pdfView';
import { Category } from '@mui/icons-material';


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
                noOfNights : data.noOfNights,
                trackingId : data.trackingId,
                category : data.starCategory.label,
                contactDetails : data.contactDetails,
                hotels: data.hotels.map((hotel) => {
                    return {
                        destination: hotel.hotels[0].destination,
                        hotelName: hotel.hotels[0].hotelName,
                        roomRates: hotel.hotels[0].roomRates.family_suite,
                        roomName: hotel.hotels[0].roomRates.family_suite.roomName,
                        occupancy: hotel.hotels[0].roomRates.family_suite.occupancy,
                        stdRoomPrice : hotel.hotels[0].roomRates.family_suite.stdRoomPrice,
                        selectedRooms : hotel.hotels[0].selectedRooms[0],

                        // stdRoomPrice : hotel.hotels[0].selectedRooms.extraRates
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
        <PdfView packageData = {packageData}/>
    );
};

export default PackagePdf;