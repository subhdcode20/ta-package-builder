import React, { useState } from 'react';
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

import { submitPackageData } from './packBuilderSlice.js';
import { db, auth } from "../firebaseConfig";

const SavePackagePdf = () => {
    const selectedPackHotels = useSelector((state) => state.packBuilderData.selectedHotels) || {};
	const selectedItineraryText = useSelector((state) => state.packBuilderData.itineraryDesc) || {};
	const totalDayPrices = useSelector((state) => state.packBuilderData.totalDayPrices) || [];
	const finalPackPrice = useSelector((state) => state.packBuilderData.finalPackPrice) || '';
	const finalTransferPrice = useSelector((state) => state.packBuilderData.finalTransferPrice) || '';
	const itiFlightsData = useSelector((state) => state.packBuilderData.itiFlightsData) || {};
    const userData = JSON.parse(localStorage.getItem("user"));
	const reqData = useSelector((state) => state.packBuilderData.reqData) || {};
	const {reqId} = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [ loading, setLoading ] = useState(false);

    const savePackageWithPdf = async () => {
		// TODO: handle data validation, show validation errors
		setLoading(true);

		//calculate Package Price
		
		try {
			let newPackId = nanoid();
			console.log("new pack save pdf", newPackId, finalTransferPrice);
			let finalHotelDetails = [...selectedPackHotels];
			// .map((day, dayIndex) => {
			// 	let dayHotels = { ...day?.hotels[0] };
			// 	if(day?.hotels[0]?.roomRates) day.hotels[0]["roomRates"] = null;   //dayHotels.roomRates;
			// 	// day.hotels[0] = dayHotels;
			// 	return day;
			// })
			let finalPackDetails = {
				hotels: finalHotelDetails,
				flights: itiFlightsData,
				itiTexts: selectedItineraryText,
				packageId: newPackId,
				totalDayPrices,
				finalPackPrice,
				finalTransferPrice,
				createdAt: Date.now(),
				userId: userData?.phone,
				reqId,
				destination: reqData?.destination,
				noOfNights: reqData?.noOfNights,
				startDate: reqData?.startDate,
				trackingId: reqData?.trackingId
			}
			console.log("new pack post finalPackDetails ", newPackId, finalPackDetails);

			dispatch(submitPackageData(finalPackDetails));
			let packRef = await setDoc(doc(db, "packages", newPackId), finalPackDetails);
			
			let reqPackRef = doc(db, "requests", reqId);
			// const reqDoc = await getDoc(reqPackRef);
			
			// // Check if the document exists
			// if (reqDoc.exists()) {
			// 	const packageData = reqDoc.data()?.packages || []; 
			
			// 	await updateDoc(reqPackRef, {
			// 		packages: [...packageData, newPackId] 
			// 	});
			// } else {
			// 	await setDoc(reqPackRef, {
			// 		packages: [newPackId],
			// 	});
			// }
			
			await setDoc(
				reqPackRef, 
				{
					packages: arrayUnion(newPackId),
					dropLoc: reqData?.dropLoc
				},
				{merge: true}
			);


			// TODO: show success popup
			setLoading(false);
		} catch (error) {
			console.log("save Complete Package catch error ", error);
			alert("Error saving package.")
			setLoading(false);
		}
		// eta template wip
				

		// return;
		// setTimeout(() => navigate(`/my-reqs?reqId=${reqId}`));
    }

    return (<Button size="small" variant="contained" onClick={savePackageWithPdf} sx={{ minWidth: "fit-content", my: 'auto' }}>
		Save Package Details
		{/* {
			loading && <CircularProgress color="secondary" size="5px" sx={{ ml: 1 }} />
		} */}
	</Button>)
}

export default SavePackagePdf;