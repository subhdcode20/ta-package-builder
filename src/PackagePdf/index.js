import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { doc, getDoc } from 'firebase/firestore';
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { db } from '../firebaseConfig';
import { MainContext } from '../Utility.js';
// import PdfView from './pdfView';
import { aiAboutDest } from '../PackageBuilder/geminiComponents.js';
import HtmlTemplate from './htmlTemplate.js';
import { setProfileData, setAboutDest } from '../PackageBuilder/packBuilderSlice.js';

// Temporary defined HERE:
const destinationImages = {
    "kerala": '/kerala2.png',
    "karnataka": '/kerala2.png',
	"bali": '/bali-banner.jpg',
    // TO add More Images
  };

const PackagePdf = ({ pkgSelectedHotels = [], reqData = {} 	 , totalPrice=null}) => {
    // // const { packageId } = useParams();
    // // const [packageData, setPackageData] = useState([]);
	const arrFlightsText = useSelector((state) => state.packBuilderData.arrFlightsText) || null;
	const userProfileData = useSelector((state) => state.packBuilderData.userProfileData) || null;
	const userData = JSON.parse(localStorage.getItem("user"));  //useSelector((state) => state.packBuilderData.userData) || {};
	const [userPdfData, setUserPdfData] = useState(userData || {});
    const [loading, setLoading] = useState(false);
    const itineraryDesc = useSelector((state) => state.packBuilderData.itineraryDesc) || [];
	// const totalDayPrices = useSelector((state) => state.packBuilderData.totalDayPrices) || [];
	const finalPackPrice = useSelector((state) => state.packBuilderData.finalPackPrice) || [];
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
	let { companyInfo: { companyLogo: logoUrl } = {} } = userData || {};
	const firebaseIdToken = localStorage.getItem('afFirebaseIdToken');
	const [headerImage, setHeaderImage] = useState("");

	const dispatch = useDispatch();

	useEffect(() => {
		console.log("CHECK_IMGheader:",destinationImages[reqData?.destination.toLowerCase()] );
		setHeaderImage(destinationImages[reqData?.destination.toLowerCase()]);
		getAboutDest();
	},[reqData?.destination])

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
		console.log('response axios ', response, userData);
		setUserPdfData(prev => ({ 
			...userData, 
			logoB64Str: response.data?.data
		}))
		// setNewUserData(prev => ({ ...prev, logoB64Str: response.data?.data }));
	}

	const getProfileData = async () => {
		// console.log(reqData, 'gemRes -- ');
        console.log("Get Profile package builder", userData, userData.phone, userProfileData);
        if(userProfileData) return;
        setLoading(true);
        let docSnapPdfData = await getDoc(doc(db, "userProfileData", userData.phone));
        if (docSnapPdfData.exists()) {
            console.log("Profile Date", docSnapPdfData.data());
            dispatch(setProfileData(docSnapPdfData.data()));
        }
        setLoading(false);
        // setCancellationData(cData);
	}

	const getAboutDest = async () => {
		// console.log(reqData, 'gemRes -- ');
        if(!reqData?.destination) return;
        setLoading(true);
		let finalAboutDestText = await aiAboutDest(reqData?.destination);
        console.log("Get about destination", finalAboutDestText, userData.phone, reqData?.destination);
		if(finalAboutDestText) dispatch(setProfileData({ ...userProfileData, "aboutDestText": finalAboutDestText}));

		// setUserPdfData((prev) => {
		// 	return { ...prev, aboutDestText: docSnapPdfData.data() };
		// })
		
		// let docSnapPdfData = await getDoc(doc(db, "userProfileData", userData.phone));
        // if (docSnapPdfData.exists()) {
        //     console.log("Profile Date", docSnapPdfData.data());
        //     // dispatch(setProfileData(docSnapPdfData.data()));
		// 	setUserPdfData((prev) => {
		// 		return { ...prev, aboutDestText: docSnapPdfData.data() };
		// 	})
        // }
        setLoading(false);
        // setCancellationData(cData);
	}

    useEffect(() => {
		const getData = async () => {
			console.log("ger profile package builder ", userProfileData);
			await getProfileData();
		}
        // if(!userProfileData) {
		// }

		getData();
    }, [])

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
					dayWiseData={{"flights": arrFlightsText, "hotels": pkgSelectedHotels, "itiDesc": itineraryDesc}} 
					reqData={{ req: reqData, headerImage: headerImage}} 
					userData={userPdfData}
					totalPackPrice={finalPackPrice}
					userProfileData={{ ...userProfileData, headerImage}}
				/>
			</Box>)
		}
    </>);
};

export default PackagePdf;