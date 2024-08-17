import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import { doc, getDoc, setDoc } from "firebase/firestore";

import HotelRoomsView from "./hotelRoomsView.js";
import { isEmptyObject } from '../Utility.js';
import {store} from '../appStore/store.js';
import { handleHotelSelect, addNewHotelToCurrDay, setHotelPriceForCurrDay, todoSlice } from './packBuilderSlice.js'; //setUserHotelRates
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
	const daysArr = useSelector((state) => state.packBuilderData.daysArr) || [];
	const selectedHotels = useSelector((state) => state.packBuilderData.selectedHotels[currentDayIndex]);
	const reqData = useSelector((state) => state.packBuilderData.reqData) || {};
	const userData = useSelector((state) => state.packBuilderData.userData) || {};
	const totalDayPrices = useSelector((state) => state.packBuilderData.totalDayPrices) || [];
	// const userHotelRates = useSelector((state) => state.packBuilderData.hotelRates) || [];
	const [userHotelRates, setUserHotelRates] = useState([]);
	const [selectedDaysToCopyDetails, setSelectedDaysToCopyDetails] = useState({});
	const dispatch = useDispatch();
	const currDayPrice = totalDayPrices[currentDayIndex]?.totalPrice || '';
	console.log("pack day daya ", userHotelRates, currentDayIndex, selectedHotels, totalDayPrices, currDayPrice);

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
		console.log("checkPricefor1Day", selectedHotels);
		let totalHotelPriceForCurrDay = selectedHotels.reduce((acc, h) => {
			let totalRoomsPriceForCurrHotel = h.selectedRooms.reduce((rAcc, r) => {
				let { mp = null, roomPrice = null, selectedOccupancy = {}, stdRoomPrice = {}, extraRates = {},  } = r;
				if(!mp) {
					// TODO: show validation error
					return 0;
				}
				// if(stdRoomPrice) {
				// 	let rPrice = stdRoomPrice[mp], childPrice = extraRates["extraChild"];
				// 	console.log("checkPricefor1Day 1Room", mp, rPrice, rAcc + Number(rPrice) * Number(selectedOccupancy?.adults));
				// 	rAcc += Number(rPrice) * Number(selectedOccupancy?.adults);
				// 	return rAcc + Number(childPrice) * Number(selectedOccupancy?.child);
				// } else if(roomPrice) {
					return rAcc + Number(roomPrice);
				// }
			}, 0);
			console.log("checkPricefor1Day 1Hotel", acc + totalRoomsPriceForCurrHotel);
			return acc + totalRoomsPriceForCurrHotel;
		}, 0);
		dispatch(setHotelPriceForCurrDay({totalHotelPriceForCurrDay, selectedHotelCurrDay: selectedHotels, copyDetailsToDays: selectedDaysToCopyDetails}));
	}

	const handleCopyDetailsFromCurrDay = (dayIndex, selectedState) => {
		console.log("copy day data", dayIndex, selectedState);
		setSelectedDaysToCopyDetails((prev) => {
			return {
				...prev,
				[dayIndex]: selectedState
			}
		})
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
				<Box display="flex">
					<Typography variant="subtitle1" color="primary" sx={{ mb: 1, margin: 'auto' }}>Copy Details for: </Typography>
					<FormGroup row={true} sx={{display: "flex"}}>
						{
							(daysArr || []).map((aa, aIndex) => {
								let dayNo = aIndex + 1;
								console.log("copy day render ",daysArr.length, aIndex, currentDayIndex, aa, Number(aIndex) > Number(currentDayIndex));
								if(aIndex > currentDayIndex) {
									return (<FormControlLabel 
											control={<Checkbox  />} 
											label={`Day ${dayNo}`}
											checked={selectedDaysToCopyDetails[dayNo]}
											onChange={(e) => handleCopyDetailsFromCurrDay(dayNo, e.target.checked)}
											inputProps={{ 'aria-label': 'controlled' }}
										/>)
								} else return null
							})
						}
					</FormGroup>
				</Box>
				<Button size="small" variant="outlined" onClick={checkPricefor1Day}>Save</Button>
			</Box>
		</Grid>
	</Grid>)
}

export default PackageDetailsFor1Day;