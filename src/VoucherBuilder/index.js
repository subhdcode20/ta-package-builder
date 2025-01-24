import React, { useState, useEffect, useContext } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useMediaQuery from "@mui/material/useMediaQuery";

import SnackbarMsg from "../Commons/snackbarMsg";
import DayWiseTabs from "../PackageBuilder/dayWiseTabs.js";
import { db, auth } from "../firebaseConfig";
import { isEmptyObject, MainContext, readStreamData } from '../Utility.js';
import { createEmptyPackageDataDayWise, submitPackageData, submitReqData, savePackageData } from '../PackageBuilder/packBuilderSlice.js';
import ReqDataView from '../Commons/reqCard.js';
// // import HtmlTemplate from '../PackagePdf/htmlTemplate.js';
import VoucherPdfView from '../PackagePdf/voucherPdfIndex.js';
import useTotalPackPrice from '../PackageBuilder/useTotalPackPrice.js';
import SavePackagePdf from '../PackageBuilder/savePackagePdf.js';
import ConfirmInputs from './confirmInputs.js';

const DayWisePackageBuilder = () => {
	const storeReqData = useSelector((state) => state.packBuilderData.reqData);
	// const storePackageData = useSelector((state) => state.packBuilderData.packageData);
	const storeNewPackageData = useSelector((state) => state.packBuilderData.newPackageData);
	const storeSelectedHotels = useSelector((state) => state.packBuilderData.selectedHotels);
	const [reqData, setReqData] = useState(null);
	const [userPdfData, setUserPdfData] = useState({});
	const [packageData, setPackageData] = useState(null);
    const [ showSnackbar, setShowSnackbar ] = useState();
	const { userData } = useContext(MainContext)
	const { reqId = null, packageId = null } = useParams();
	const dispatch = useDispatch();
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const totalPackPrice = useTotalPackPrice();
	const { roomOcc = [] } = reqData || {};

	console.log("USERCURR:", JSON.parse(localStorage.getItem("user") || null));
	useEffect(() => {
		const getUserPdfData = async () => {
			let docSnapPdfData = await getDoc(doc(db, "userPdfData", userData.phone));
			if (docSnapPdfData.exists()) {
				console.log("DocSnapPdfData", docSnapPdfData.data());
				let { logoB64Str = null } = docSnapPdfData.data();	
				setUserPdfData({ 
					userPhone: userData.phone, 
					logo: logoB64Str
				})
			}
		}

		getUserPdfData();
	}, [userData])

	useEffect(() => {
		if (!storeReqData || isEmptyObject(storeReqData)) return;
		let { roomOcc = [] } = storeReqData;
		console.log("reqtest- set from store", storeReqData, roomOcc, reqData && reqData?.destination);
		let totalPaxCount = roomOcc.reduce((acc, i) => {
			console.log('totalPaxCount loop ', acc, i);
			acc.adultPax += Number(i.adultPax || 0);
			acc.childPax += Number(i.childPax || 0);
			return acc;
		}, { adultPax: 0, childPax: 0 });
		setReqData({
			...storeReqData,
			totalAdultPax: totalPaxCount?.adultPax || 0,
			totalChildPax: totalPaxCount?.childPax || 0
		});
	}, storeReqData);
	
	// useEffect(() => {
	// 	if (!storePackageData || isEmptyObject(storePackageData)) return;
	// 	console.log("storePackageData", storePackageData);
	// 	setPackageData(storePackageData);
	// }, [storePackageData]);

	const getPackageData = async (packageId) => {
		console.log("Yes packages is THERE!", packageId);
		let docSnapPackages = await getDoc(doc(db, "packages", packageId));
		if (docSnapPackages.exists()) {
			console.log("DocSnapPackageData", docSnapPackages.data());
			// setTimeout(() => {
			// 	dispatch(submitPackageData({ packageData: docSnapPackages.data() }));
			// });
			setTimeout(() => {
				dispatch(savePackageData({ packageData: docSnapPackages.data() }));
			});
		} else {
			console.error(`Package details not forund for ${reqId}`);
			// TODO show page error
			return null;
		}
	}
	
	useEffect(() => {
		const getReqs = async () => {
			if (!reqId) return; // TODO show page error
			let docSnap = await getDoc(doc(db, "requests", reqId));
			if (docSnap.exists()) {
				console.log("booking user data ", docSnap.data());
				// setBookingPartnerDetails(docSnap.data());
				// setReqData(docSnap.data());
				const data = docSnap.data();
				setTimeout(() => {
					dispatch(submitReqData({ reqData: docSnap.data() }));
				});
				// if(data?.packages && data?.packages.length > 0){
                    // 	let len = data.packages.length;
                    // 	console.log("LENTEMP", data.packages[len-1]);
                    // 	const packageId = data?.packages[len - 1];
                    // 	getPackageData(packageId);				
                    // }
                let pkgExistsInReq = (data?.packages || []).find((i) => i == packageId);
                console.log("REQDATA::", data?.packages, packageId, pkgExistsInReq);
                if(pkgExistsInReq) getPackageData(packageId);
			} else {
				console.error(`Req details not forund for ${reqId}`);
				// TODO show page error
				return null;
			}
		}
		if (reqId && (!reqData || isEmptyObject(reqData)))
			getReqs();
		
	}, [reqId])
	
	// const getHotelList = async () => {
		// const docRef = doc(db, "userHotelRates", userId);
		// const docSnap = await getDoc(docRef);
		// if (!docSnap.exists()) {
			// 	console.log("hotelList not found for user.")
			// }
	// }
		
	console.log("package builder index render ", reqId, reqData, storeReqData, storeSelectedHotels, userData)
	// console.log("PACKAGEDATASTORE:", storePackageData);
	console.log("SAVEDPACKAGEDATA:", storeNewPackageData);
	// console.log("SAVEPACKGEINDEX: ", packageData?.hotels[0].hotels[0]);
	return (<>
		<Box display="flex" flexDirection={isMobile ? 'column' : 'row'} >
			<Box sx={{ "display": "flex", flexDirection: "column", flex: 1.5, mr: 1 }}>
				<Typography variant="h6" sx={{textAlign: "flex-start", fontWeight: '400', color: '#333'}} >Select Itinerary Details</Typography>
				<Box>
					{reqData && <ReqDataView reqData={reqData} />}
                    <ConfirmInputs />
					{reqData && !isEmptyObject(reqData) && <DayWiseTabs/>}
				</Box>
			</Box>
            <VoucherPdfView pkgSelectedHotels={storeSelectedHotels} reqData={reqData} />
			{/* <PackagePdfView pkgSelectedHotels={storeSelectedHotels} reqData={reqData} /> */}
		</Box>
		<SavePackagePdf />
        {showSnackbar && (
			<SnackbarMsg
				open={showSnackbar.open}
				message={showSnackbar.message}
				anchorOrigin={showSnackbar.anchorOrigin}
				severity={showSnackbar.severity || "success"}
				onClose={() => setShowSnackbar({ open: false })}
			/>
		)}
	</>)

}

export default DayWisePackageBuilder;