import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { doc, getDoc } from 'firebase/firestore';
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { db } from '../firebaseConfig';
import { MainContext, getB64Img, formattedAmountINR } from '../Utility.js';
// import PdfView from './pdfView';
import { DEFAULT_POLICIES } from '../Constants.js';
import { aiAboutDest } from '../PackageBuilder/geminiComponents.js';
import HtmlTemplate from './htmlTemplate.js';
import { setProfileData, setAboutDest } from '../PackageBuilder/packBuilderSlice.js';
import destImagesMap from './destPdfImagesMap.js';

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
	const itiFlightsData = useSelector((state) => state.packBuilderData.itiFlightsData) || null;
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
	// const [templateData, setTemplateData] = useState(null)
	const [headerImage, setHeaderImage] = useState("");
	const {
		cancellationData = DEFAULT_POLICIES["cancellationPolicyDefault"], 
		paymentPolicy = DEFAULT_POLICIES["paymentPolicyDefault"],
		inclusions = DEFAULT_POLICIES["inclusionsDefault"], 
		exclusions = DEFAULT_POLICIES["exclusionsDefault"],
	} = userProfileData || {};

	const dispatch = useDispatch();

	useEffect(() => {
		const getDestImgB64 = async () => {
			if(!reqData?.destination) return;
			let dest = reqData?.destination.toLowerCase();
			console.log("CHECK_IMGheader:", dest, destImagesMap, destImagesMap[dest]);
			// setHeaderImage(destinationImages[reqData?.destination.toLowerCase()]);
			let randomDestImgIndex = 0
			if(destImagesMap[dest].length > 0) {
				randomDestImgIndex = Math.floor(Math.random() * destImagesMap[dest].length);
				console.log("dest img select ", randomDestImgIndex, destImagesMap[dest][randomDestImgIndex])
				// destImagesMap[dest][randomDestImgIndex] = "https://firebasestorage.googleapis.com/v0/b/agentflow-d0eec.firebasestorage.app/o/destPdfAssets%2Fkerala%2Fimages-kerala.png?alt=media&token=16d4271b-aa97-43f9-a34d-53cdbe98e3e7"
				// 'https://media.istockphoto.com/id/154232673/photo/blue-ridge-parkway-scenic-landscape-appalachian-mountains-ridges-sunset-layers.jpg?s=612x612&w=0&k=20&c=m2LZsnuJl6Un7oW4pHBH7s6Yr9-yB6pLkZ-8_vTj2M0='
				let { data = null, err = null } = await getB64Img({ logoUrl:  destImagesMap[dest][randomDestImgIndex] });
				console.log("getB64Img headerImg ", data);
				setHeaderImage(data);
			}
		}

		getDestImgB64();
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
		return response.data?.data;
		// setUserPdfData(prev => ({ 
		// 	...userData, 
		// 	logoB64Str: response.data?.data
		// }))

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
		// if(logoUrl) {
		//   //fetch logo base64
		//   getLogoB64encoded();
		// }
		const getLogoB64 = async () => {
			let { data = null, err = null } = await getB64Img({ logoUrl });
			console.log("getB64Img final ", data);
			setUserPdfData(prev => ({ 
				...userData, 
				logoB64Str: data
			}))
		}

		getLogoB64();
	}, [logoUrl]);

    if (loading) {
        return (<Box display="flex" flexDirection='column' justifyContent={'center'} style={{ flex: 1, justifyContent: 'flex-start', minWidth: !isMobile ? '40%' : '100%' }}>
			<Typography sx={{ marginTop: 2, marginX: 'auto' }}>Pdf Loading...</Typography>
		</Box>);
    }

    console.log("packagePdf render => ", cancellationData, headerImage, finalPackPrice, pkgSelectedHotels, userPdfData);

    return (<>
        {
			pkgSelectedHotels && (<Box display="flex" flexDirection='column' style={{ flex: 1, minWidth: !isMobile ? '40%' : '100%' }}>
				<HtmlTemplate 
					dayWiseData={{"flights": itiFlightsData, "hotels": pkgSelectedHotels, "itiDesc": itineraryDesc}} 
					reqData={{ req: reqData, headerImage: headerImage}} 
					userData={userPdfData}
					totalPackPrice={formattedAmountINR(finalPackPrice)}
					userProfileData={{ ...userProfileData, cancellationData, paymentPolicy, inclusions, exclusions, headerImage }}
				/>
			</Box>)
		}
    </>);
};

export default PackagePdf;