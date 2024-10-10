import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useMediaQuery from "@mui/material/useMediaQuery";

import DayWiseTabs from "./dayWiseTabs.js";
import { db, auth } from "../firebaseConfig";
import { isEmptyObject } from '../Utility.js';
import { createEmptyPackageDataDayWise, submitPackageData, submitReqData, savePackageData } from './packBuilderSlice.js';
import ReqDataView from '../Commons/reqCard.js';
import HtmlTemplate from '../PackagePdf/htmlTemplate.js';

const DayWisePackageBuilder = () => {
	const storeReqData = useSelector((state) => state.packBuilderData.reqData);
	const storePackageData = useSelector((state) => state.packBuilderData.packageData);
	const storeNewPackageData = useSelector((state) => state.packBuilderData.newPackageData);
	const storeSelectedHotels = useSelector((state) => state.packBuilderData.selectedHotels);
	const [reqData, setReqData] = useState(null);
	const [packageData, setPackageData] = useState(null);
	const { reqId = null } = useParams();
	const dispatch = useDispatch();
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

	useEffect(() => {
		if (!storeReqData || isEmptyObject(storeReqData)) return;
		console.log("reqtest- set from store", storeReqData, reqData && reqData?.destination);
		setReqData(storeReqData);
	}, storeReqData);
	
	useEffect(() => {
		if (!storePackageData || isEmptyObject(storePackageData)) return;
		console.log("storePackageData", storePackageData);
		setPackageData(storePackageData);
	}, [storePackageData]);

	const getPackageData = async (packageId) =>{
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
				console.log("REQDATA::", reqData);
				if(data?.packages && data?.packages.length > 0){
					let len = data.packages.length;
					console.log("LENTEMP", data.packages[len-1]);
					const packageId = data?.packages[len - 1];
					getPackageData(packageId);				
				}	
			} else {
				console.error(`Req details not forund for ${reqId}`);
				// TODO show page error
				return null;
			}
		}
		if (reqId && (!reqData || isEmptyObject(reqData)))
			getReqs();
		
	}, [reqId])
	
	const getHotelList = async () => {
		// const docRef = doc(db, "userHotelRates", userId);
		// const docSnap = await getDoc(docRef);
		// if (!docSnap.exists()) {
			// 	console.log("hotelList not found for user.")
			// }
		}
		
		console.log("package builder index render ", reqId, reqData, storeReqData, storePackageData, storeSelectedHotels)
		console.log("PACKAGEDATASTORE:", storePackageData);
		console.log("SAVEDPACKAGEDATA:", storeNewPackageData);
		console.log("SAVEPACKGEINDEX: ", packageData?.hotels[0].hotels[0]);
		return (<Box display="flex" flexDirection={isMobile ? 'column' : 'row'} sx={{margin:2}}>
			<Box sx={{ "display": "flex", flexDirection: "column", flex: 1.5, mr: 1 }}>
				<Typography variant="h6" sx={{textAlign:"center"}} ><b>Select Itinerary Details</b></Typography>
				<Box>
					{reqData && <ReqDataView reqData={reqData} />}
					{reqData && !isEmptyObject(reqData) && <DayWiseTabs/>}
				</Box>
			</Box>
			{
				storeSelectedHotels && (<Box display="flex" flexDirection='column' style={{ flex: 1, maxWidth: !isMobile ? '40%' : '100%' }}>
					<Typography variant="h6" sx={{ margin: 'auto' }}><b>Pdf Preview</b></Typography>
					<HtmlTemplate packageData={{"hotels": storeSelectedHotels}} />
				</Box>)
			}
		</Box>)

}

export default DayWisePackageBuilder;