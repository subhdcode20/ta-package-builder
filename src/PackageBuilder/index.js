import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import DayWiseTabs from "./dayWiseTabs.js";
import { db, auth } from "../firebaseConfig";
import { isEmptyObject } from '../Utility.js';
import { createEmptyPackageDataDayWise, submitPackageData, submitReqData } from './packBuilderSlice.js';
import ReqDataView from '../Commons/reqCard.js';

const DayWisePackageBuilder = () => {
	const storeReqData = useSelector((state) => state.packBuilderData.reqData);
	const storePackageData = useSelector((state) => state.packBuilderData.packageData);
	const [reqData, setReqData] = useState(null);
	const [packageData, setPackageData] = useState(null);
	const { reqId = null } = useParams();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!storeReqData || isEmptyObject(storeReqData)) return;
		console.log("reqtest- set from store", storeReqData, reqData && reqData?.destination);
		setReqData(storeReqData);
	}, storeReqData)
	useEffect(() => {
		if (!storePackageData || isEmptyObject(storePackageData)) return;
		console.log("storePackageData", storePackageData);
		setPackageData(storePackageData);
	}, [storePackageData]);

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
				if(data?.packages.length > 0){
					console.log("Yes packages is THERE!");
					const packageId = data?.packages[data?.packages.length - 1];
					let docSnapPackages = await getDoc(doc(db, "packages", packageId));
					if (docSnapPackages.exists()) {
						console.log("DocSnapPackageData", docSnapPackages.data());
						setTimeout(() => {
							dispatch(submitPackageData({ packageData: docSnapPackages.data() }));
						});
					} else {
						console.error(`Package details not forund for ${reqId}`);
						// TODO show page error
						return null;
					}
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

	console.log("package builder index render ", reqId, reqData, storeReqData, storePackageData)
	console.log("PACKAGEDATA:", storePackageData);
	return (<>
		<Box sx={{ "display": "flex", mb: 2 }}>
			<Typography variant="h6" sx={{ margin: 'auto' }}><b>Select Itinerary Details</b></Typography>
		</Box>
		{reqData && <ReqDataView reqData={reqData} />}
		{reqData && !isEmptyObject(reqData) && <DayWiseTabs/>}
	</>)

}

export default DayWisePackageBuilder;