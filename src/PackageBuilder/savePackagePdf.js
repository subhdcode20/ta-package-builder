import Button from "@mui/material/Button";
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import { db, auth } from "../firebaseConfig";

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

const SavePackagePdf = () => {
    const selectedPackDetails = useSelector((state) => state.packBuilderData.selectedHotels) || {};
    const userData = useSelector((state) => state.packBuilderData.userData) || {};
	const reqData = useSelector((state) => state.packBuilderData.reqData) || {};
	const {reqId} = useParams();

    const savePackageWithPdf = async () => {
		// TODO: handle data validation, show validation errors
		let newPackId = nanoid();
        console.log("new pack save pdf", newPackId);
		let finalPackDetails = selectedPackDetails
		// .map((p) => {
		// 	return {
		// 		"hotels": p
		// 	}
		// });
		// dispatch(submitReqData({reqData: newReqData}));
		console.log("new pack post 2: ", newPackId, finalPackDetails, reqData);
		let packRef = await setDoc(doc(db, "packages", newPackId), {
			hotels: finalPackDetails, 
            packageId: newPackId,
			userId: userData?.phone,
			createdAt: Date.now(),
			req: {
				...reqData
			}
		});
		
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
		// return;
		// setTimeout(() => navigate("/itinerary/"+newReqId));
    }

    return (<Button size="small" variant="outlined" onClick={savePackageWithPdf}>Generate Pdf</Button>)
}

export default SavePackagePdf;