import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { doc, getDoc } from 'firebase/firestore';
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import { useSelector } from 'react-redux';
import axios from 'axios';

import { db } from '../firebaseConfig';
import { MainContext } from '../Utility.js';
// import PdfView from './pdfView';
import HtmlTemplate from './htmlTemplate.js';


const PackagePdf = ({ pkgSelectedHotels = [], reqData = {} 	 , totalPrice=null}) => {
    // // const { packageId } = useParams();
    // // const [packageData, setPackageData] = useState([]);
	const { userData } = useContext(MainContext)
	const [userPdfData, setUserPdfData] = useState(userData || {});
    const [loading, setLoading] = useState(false);
    const itineraryDesc = useSelector((state) => state.packBuilderData.itineraryDesc) || [];
	// const totalDayPrices = useSelector((state) => state.packBuilderData.totalDayPrices) || [];
	const finalPackPrice = useSelector((state) => state.packBuilderData.finalPackPrice) || [];
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
	let { companyInfo: { companyLogo: logoUrl } = {}, firebaseIdToken = '' } = userData;

	const getLogoB64encoded = async () => {
		const axiosOptions = {
		  method: 'POST',
		  headers: { 
			  // 'content-type': 'application/x-www-form-urlencoded',
			  'Authorization': firebaseIdToken 
		  },
		  data: {
			logoUrl: logoUrl
		  },
		  url: `${process.env.REACT_APP_API_DOMAIN}/api/get-logo-b64`,
		};
		console.log('request axios ', axiosOptions);
	
		let response = await axios(axiosOptions);
		console.log('response axios ', response);
		setUserPdfData(prev => ({ 
			...prev, 
			logoB64Str: response.data?.data
		}))
		// setNewUserData(prev => ({ ...prev, logoB64Str: response.data?.data }));
	}

    // useEffect(() => {
	// 	// const getUserPdfData = async () => {
	// 	// 	let docSnapPdfData = await getDoc(doc(db, "userPdfData", userData.phone));
	// 	// 	if (docSnapPdfData.exists()) {
	// 	// 		console.log("DocSnapPdfData", docSnapPdfData.data());
	// 	// 		let { logoB64Str = null } = docSnapPdfData.data();	
	// 	// 		setUserPdfData({ 
	// 	// 			...userData, 
	// 	// 			logoB64Str
	// 	// 		})
	// 	// 	}
	// 	// }

	// 	// getUserPdfData();
	// 	// getLogoB64encoded();
	// }, [userData])

	useEffect(() => {
		console.log("CHECKBIDDATAINSIDE axios LOGO - ", logoUrl)
		if(logoUrl) {
		  //fetch logo base64
		  getLogoB64encoded();
		}
	}, [logoUrl]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    console.log("packagePdf render => ", finalPackPrice, pkgSelectedHotels, userPdfData);

    return (<>
        {
			pkgSelectedHotels && (<Box display="flex" flexDirection='column' style={{ flex: 1, maxWidth: !isMobile ? '40%' : '100%' }}>
				<Typography variant="h6" textAlign={'center'}><b>Pdf Preview</b></Typography>
				<HtmlTemplate 
					dayWiseData={{"hotels": pkgSelectedHotels, "itiDesc": itineraryDesc}} 
					reqData={{ req: reqData }} 
					userData={userPdfData}
					totalPackPrice={finalPackPrice}
				/>
			</Box>)
		}
    </>);
};

export default PackagePdf;