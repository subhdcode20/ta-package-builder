import React, { useContext } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import DayWiseTabs from "./dayWiseTabs.js";

const DayWisePackageBuilder = () => {

	const getHotelList = async () => {
		// const docRef = doc(db, "userHotelRates", userId);
	    // const docSnap = await getDoc(docRef);
	    // if (!docSnap.exists()) {
	    // 	console.log("hotelList not found for user.")
	    // }
	}

	return (<>
		<Box sx={{"display": "flex", mb: 2}}>
			<Typography variant="h6" sx={{margin: 'auto'}}><b>Select Details Day-wise</b></Typography>
		</Box>
		
		<DayWiseTabs />
	</>)

}

export default DayWisePackageBuilder;