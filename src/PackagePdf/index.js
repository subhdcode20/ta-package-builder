import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import Typography from '@mui/material/Typography';
import { doc, getDoc } from 'firebase/firestore';

// import PdfView from './pdfView';
import HtmlTemplate from './htmlTemplate.js';


const PackagePdf = () => {
    const { packageId } = useParams();
    const [packageData, setPackageData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPackageData = async () => {
        let docRef = doc(db, "packages", packageId);
        let docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("pdf package data", data)
            setPackageData(data);
            // setPackageData([{
            //     createdAt: data.createdAt,
            //     userId: data.userId,
            //     packageId: data.packageId,
            //     req: data.req?.req,
            //     category : data.req?.starCategory.value,
            //     // contactDetails : data.contactDetails,
            //     hotels: data.hotels.map((hotel) => {
            //         return {
            //             hotelId: hotel.hotels[0].hotelId,
            //             destination: hotel.hotels[0].destination,
            //             hotelName: hotel.hotels[0].hotelName,
            //             selectedRooms: hotel.hotels[0].selectedRooms,
            //             // stdRoomPrice : hotel.hotels[0].roomRates.family_suite.stdRoomPrice
            //             // extraRates : hotel.hotels[0].selectedRooms.extraRates
            //         };
            //     }),
            // }]);
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
        <HtmlTemplate packageData={packageData} />
    );
};

export default PackagePdf;