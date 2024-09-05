import Button from "@mui/material/Button";
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import { db, auth } from "../firebaseConfig";

import { doc, setDoc } from "firebase/firestore";

const SavePackagePdf = () => {
    const selectedPackDetails = useSelector((state) => state.packBuilderData.selectedHotels) || {};
    const userData = useSelector((state) => state.packBuilderData.userData) || {};

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
		console.log("new pack post 2: ", newPackId, finalPackDetails);
		let packRef = await setDoc(doc(db, "packages", newPackId), {
			hotels: finalPackDetails, 
            packageId: newPackId,
			userId: userData?.phone,
			createdAt: Date.now()
		});

		// return;
		// setTimeout(() => navigate("/itinerary/"+newReqId));
    }

    return (<Button size="small" variant="outlined" onClick={savePackageWithPdf}>Generate Pdf</Button>)
}

export default SavePackagePdf;