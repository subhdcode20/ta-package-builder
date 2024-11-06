import React, { useState } from 'react';
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

import { submitPackageData } from './packBuilderSlice.js';
import { db, auth } from "../firebaseConfig";

const SavePackagePdf = () => {
    const selectedPackDetails = useSelector((state) => state.packBuilderData.selectedHotels) || {};
    const userData = useSelector((state) => state.packBuilderData.userData) || {};
	const reqData = useSelector((state) => state.packBuilderData.reqData) || {};
	const {reqId} = useParams();
	const dispatch = useDispatch();
	const [ loading, setLoading ] = useState(false);

    const savePackageWithPdf = async () => {
		// TODO: handle data validation, show validation errors
		setLoading(true);
		try {
			let newPackId = nanoid();
			console.log("new pack save pdf", newPackId);
			let finalHotelDetails = selectedPackDetails
			// .map((p) => {
			// 	return {
			// 		"hotels": p
			// 	}
			// });
			// dispatch(submitReqData({reqData: newReqData}));
			console.log("new pack post 2: ", newPackId, finalHotelDetails, reqData);
			let finalPackDetails = {
				hotels: finalHotelDetails, 
				packageId: newPackId,
				userId: userData?.phone,
				createdAt: Date.now(),
				req: {
					...reqData
				}
			}
			dispatch(submitPackageData(finalPackDetails));
			let packRef = await setDoc(doc(db, "packages", newPackId), finalPackDetails);
			
			let reqPackRef = doc(db, "requests", reqId);
			const reqDoc = await getDoc(reqPackRef);
			
			// Check if the document exists
			if (reqDoc.exists()) {
				const packageData = reqDoc.data()?.packages || []; 
			
				await updateDoc(reqPackRef, {
					packages: [...packageData, newPackId] 
				});
			} else {
				await setDoc(reqPackRef, {
					packages: [newPackId],
				});
			}
			// TODO: show success popup
			setLoading(false);
		} catch (error) {
			console.log("save Complete Package catch error ", error);
			setLoading(false);
		}
		// eta template wip
				

		// return;
		// setTimeout(() => navigate("/itinerary/"+newReqId));
    }

    return (<Button size="small" variant="contained" onClick={savePackageWithPdf} sx={{ minWidth: "fit-content", my: 'auto' }}>
		Save Package Details
		{/* {
			loading && <CircularProgress color="secondary" size="5px" sx={{ ml: 1 }} />
		} */}
	</Button>)
}

export default SavePackagePdf;