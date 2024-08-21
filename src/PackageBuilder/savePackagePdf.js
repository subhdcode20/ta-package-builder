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
		let newPackData = { 
            hotels: selectedPackDetails, 
            packageId: newPackId,
			userId: userData?.phone
        };
        console.log("new pack save pdf", newPackData);
		// dispatch(submitReqData({reqData: newReqData}));
		let packRef = await setDoc(doc(db, "packages", newPackId), {
			hotels: selectedPackDetails, 
            packageId: newPackId,
			userId: userData?.phone,
			createdAt: Date.now()
		});
		console.log("new pack post 2: ", newPackData, newPackId, packRef);

		// return;
		// setTimeout(() => navigate("/itinerary/"+newReqId));
    }

    return (<Button size="small" variant="outlined" onClick={savePackageWithPdf}>Generate Pdf</Button>)
}

export default SavePackagePdf;