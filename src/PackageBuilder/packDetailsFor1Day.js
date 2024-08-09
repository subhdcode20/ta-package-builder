import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import { doc, getDoc, setDoc } from "firebase/firestore";

import HotelRoomsView from "./hotelRoomsView.js";
import { isEmptyObject } from '../Utility.js';
import {store} from '../appStore/store.js';
import { handleHotelSelect, addNewHotelToCurrDay } from './packBuilderSlice.js'; //setUserHotelRates
import { db, auth } from "../firebaseConfig";

const hotelsList = [
	{	
		name: "Le Meridian"
	},
	{
		name: "Pullman"
	}
]

const PackageDetailsFor1Day = ({key}) => {
	const currentDayIndex = useSelector((state) => state.packBuilderData.currDayIndex);
	const selectedHotels = useSelector((state) => state.packBuilderData.selectedHotels[currentDayIndex]);
	const reqData = useSelector((state) => state.packBuilderData.reqData) || {};
	const userData = useSelector((state) => state.packBuilderData.userData) || {};
	// const userHotelRates = useSelector((state) => state.packBuilderData.hotelRates) || [];
	const [userHotelRates, setUserHotelRates] = useState([]);
	const dispatch = useDispatch();
	console.log("pack day daya ", userHotelRates, currentDayIndex, selectedHotels, store.getState());
	
	useEffect(() => {
		if(!reqData || !reqData?.destination || !userData?.phone) return;
		console.log("reqtest- get Hotel rates", reqData, userData);
		const getUserHotelRates = async () => {
			const { destination} = reqData || {};
			console.log("reqtest- getUserHotelRates reducer", destination, userData?.phone);
			if(!destination || !userData?.phone) return; // TODO show page error
			let docName = `${userData?.phone}-${destination.toLowerCase()}`;
			let docSnap = await getDoc(doc(db, "userHotels", docName));
			if (docSnap.exists()) {
			    let ratesData = docSnap.data();
				console.log("reqtest- user hotel rates data ", ratesData);
				// setBookingPartnerDetails(docSnap.data());
				// setReqData(docSnap.data());
			    // state.hotelRates = ratesData?.hotels || [];
				// dispatch(setUserHotelRates({ ratesData }));
				if(ratesData?.hotels) setUserHotelRates(ratesData?.hotels);
			} else {
				console.error(`reqtest- user hotel rates not forund for ${docName}`);
				// TODO show page error
				// return null;
			}
		}

		getUserHotelRates()
	}, [reqData, userData])

	const handleHotelChange = (hotelIndex, data) => {
		// handleDataChange(hotelIndex, data);
		dispatch(handleHotelSelect({hotelIndex, data}));
	}

	const addRoomsDataToHotelData = () => {

	}

	const addHoteltoCurrDay = () => {
		console.log("addHoteltoCurrDay");
  		dispatch(addNewHotelToCurrDay());
	}

	const checkPricefor1Day = () => {
		// const mealType = "mapai";
		// let hotelPricesArr = selectedHotels.map((h) => {
		// 	let roomsPriceArr = h.selectedRooms.map(r => {
		// 		let rPrice = r.stdRoomPrice[mealType];
		// 		if(reqData?.adults > ) 
		// 	})
		// })
	}

	return (<Grid container spacing={1} key={key}>
		{
			(selectedHotels || []).map((hData = [], hIndex) => {
				return (<Grid item xs={12}>
					<Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>Hotel {`${hIndex + 1}`}</Typography>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<InputLabel id={`d-${currentDayIndex + 1}_h-${hIndex + 1}`} sx={{fontSize: 12}}>Select Hotel*</InputLabel>
							<Autocomplete
						      fullWidth
						      size="small"
						      value={ selectedHotels[hIndex] || null }
						      onChange={(event, newValue) => {
						      	 console.log("hotel selected", newValue)
						         handleHotelChange(hIndex, newValue);
						      }}
						      selectOnFocus
						      clearOnBlur
						      handleHomeEndKeys
						      id="hotel-name"
						      options={userHotelRates}
						      getOptionLabel={(option) => {
						        console.log("hotel getOptionLabel ", option, typeof option);
						        // Regular option
						        return option.hotelName;
						      }}
						      renderOption={(props, option) => {
						        console.log("maindest renderOption ", props, option);
						        const { key, ...optionProps } = props;
						        return (
						          <li key={key} {...optionProps}>
						            {option.hotelName}
						          </li>
						        );
						      }}
						      renderInput={(params) => (
						        <TextField {...params} sx={{fontSize: 12, m: 0, padding: 0}} />
						      )}
						    />
						</Grid>
						{ !isEmptyObject(hData["selectedRooms"]) && (<HotelRoomsView hotelIndex={hIndex} addRoomsDataToHotelData={addRoomsDataToHotelData} />)}
					</Grid>
					<Grid item xs={12}>
						<hr />
					</Grid>
				</Grid>)
			})
		}
		
		<Grid item xs={12}>
			<Box display="flex" justifyContent="space-between">
				<Button size="small" variant="outlined" onClick={addHoteltoCurrDay}>Add Hotel +</Button>
				<Button size="small" variant="outlined" onClick={checkPricefor1Day}>{`Check Price for Day ${currentDayIndex + 1}`}</Button>
			</Box>
		</Grid>
	</Grid>)
}

export default PackageDetailsFor1Day;