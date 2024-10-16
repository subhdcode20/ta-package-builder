import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { doc, getDoc } from 'firebase/firestore';
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import { useSelector } from 'react-redux';

import { db } from '../firebaseConfig';
import { MainContext } from '../Utility.js';
// import PdfView from './pdfView';
import HtmlTemplate from './htmlTemplate.js';


const PackagePdf = ({ pkgSelectedHotels = [], reqData = {} , totalPrice=null}) => {
    // const { packageId } = useParams();
    // const [packageData, setPackageData] = useState([]);
	const { userData } = useContext(MainContext)
	const [userPdfData, setUserPdfData] = useState({});
    const [loading, setLoading] = useState(false);
    const itineraryDesc = useSelector((state) => state.packBuilderData.itineraryDesc) || [];
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    useEffect(() => {
		const getUserPdfData = async () => {
			let docSnapPdfData = await getDoc(doc(db, "userPdfData", userData.phone));
			if (docSnapPdfData.exists()) {
				console.log("DocSnapPdfData", docSnapPdfData.data());
				let { logoB64Str = null } = docSnapPdfData.data();	
				setUserPdfData({ 
					...userData, 
					logoB64Str
				})
			}
		}

		getUserPdfData();
	}, [userData])

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    console.log("packagePdf render => ", pkgSelectedHotels, userPdfData);
    console.log("Itinerary render => ", itineraryDesc);

    return (<>
        {
			pkgSelectedHotels && (<Box display="flex" flexDirection='column' style={{ maxWidth: !isMobile ? '40%' : '100%' }}>
				<Typography variant="h6" textAlign={'center'}><b>Pdf Preview</b></Typography>
				<HtmlTemplate dayWiseData={{"hotels": pkgSelectedHotels, "itiDesc": itineraryDesc}} reqData={{ req: reqData }} userData={userPdfData}  totalPrice={totalPrice}/>
			</Box>)
		}	
    </>);
};

export default PackagePdf;