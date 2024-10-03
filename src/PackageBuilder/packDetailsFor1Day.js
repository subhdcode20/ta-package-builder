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
import CircularProgress from '@mui/material/CircularProgress';
import parse from "html-react-parser";

import HotelRoomsView from "./hotelRoomsView.js";
import { isEmptyObject } from '../Utility.js';
import { store } from '../appStore/store.js';
import HotelSearchFree from "./hotelSearchCommon.js";
import { handleHotelSelect, addNewHotelToCurrDay, setHotelPriceForCurrDay, setItineraryDesc } from './packBuilderSlice.js'; //setUserHotelRates
import { db, auth } from "../firebaseConfig";
import { aiHotelDetails } from "./geminiComponents.js";

const PackageDetailsFor1Day = ({ key }) => {
	const currentDayIndex = useSelector((state) => state.packBuilderData.currDayIndex);
	const selectedHotels = useSelector((state) => state.packBuilderData.selectedHotels[currentDayIndex]?.hotels);
	const daysArr = useSelector((state) => state.packBuilderData.daysArr) || [];
	const reqData = useSelector((state) => state.packBuilderData.reqData) || {};
	const userData = useSelector((state) => state.packBuilderData.userData) || {};
	const totalDayPrices = useSelector((state) => state.packBuilderData.totalDayPrices) || [];
	const itineraryDesc = useSelector((state) => state.packBuilderData.itineraryDesc) || [];
	// const userHotelRates = useSelector((state) => state.packBuilderData.hotelRates) || [];
	const [userHotelRates, setUserHotelRates] = useState([]);
	const [selectedDaysToCopyDetails, setSelectedDaysToCopyDetails] = useState({});
	const [ geminiLoading, setGeminiLoading] = useState(false);
	const dispatch = useDispatch();
	const currDayPrice = totalDayPrices[currentDayIndex]?.totalPrice || '';
	console.log("pack day daya ", userHotelRates, currentDayIndex, selectedHotels, totalDayPrices, currDayPrice);
	console.log("userHotelRates", userHotelRates, "\ncurrentDayIndex", currentDayIndex, "\nselectedHotels", selectedHotels, "\ntotalDayPrices", totalDayPrices, "\ncurrDayPrice", currDayPrice);

	useEffect(() => {
		if (!reqData || !reqData?.destination || !userData?.phone) return;
		console.log("reqtest- get Hotel rates", reqData, userData);
		const getUserHotelRates = async () => {
			const { destination } = reqData || {};
			console.log("reqtest- getUserHotelRates reducer", destination, userData?.phone);
			if (!destination || !userData?.phone) return; // TODO show page error
			let docName = `${userData?.phone}-${destination.toLowerCase()}`;
			let docSnap = await getDoc(doc(db, "userHotels", docName));
			if (docSnap.exists()) {
				let ratesData = docSnap.data();
				console.log("reqtest- user hotel rates data ", ratesData);
				// setBookingPartnerDetails(docSnap.data());
				// setReqData(docSnap.data());
				// state.hotelRates = ratesData?.hotels || [];
				// dispatch(setUserHotelRates({ ratesData }));
				if (ratesData?.hotels) setUserHotelRates(ratesData?.hotels);
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
		dispatch(handleHotelSelect({ hotelIndex, data }));
	}

	const addHoteltoCurrDay = () => {
		console.log("addHoteltoCurrDay");
		dispatch(addNewHotelToCurrDay());
	}

	const checkPricefor1Day = () => {
		console.log("checkPricefor1Day", selectedHotels);
		let totalHotelPriceForCurrDay = selectedHotels.reduce((acc, h) => {
			let totalRoomsPriceForCurrHotel = h.selectedRooms.reduce((rAcc, r) => {
				let { mp = null, roomPrice = null, selectedOccupancy = {}, stdRoomPrice = {}, extraRates = {} } = r;
				if (!mp) {
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
		dispatch(setHotelPriceForCurrDay({
			totalHotelPriceForCurrDay,
			selectedHotelCurrDay: selectedHotels,
			copyDetailsToDays: selectedDaysToCopyDetails
		}));
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

	const generateItineraryDay1 = async () => {
		console.log(reqData, selectedHotels, 'gemRes -- ');
		setGeminiLoading(true);
		let gemRes = await aiHotelDetails({ reqData, selectedHotels});
		setGeminiLoading(false);
		dispatch(setItineraryDesc({text: gemRes}))
	}

	console.log("SELECTEDHOTEL:", selectedHotels, selectedHotels[0]?.location);
	return (<Grid container spacing={1} key={key}>
		{
			(selectedHotels || []).map((hData = [], hIndex) => {
				return (<Grid item xs={12}>
					<Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>Hotel {`${hIndex + 1}`}</Typography>
					<Grid container spacing={1}>
						<Grid item xs={12} display={'flex'} justifyContent={'space-between'}>
							<Grid item xs={8} md={10}>
								<InputLabel id={`d-${currentDayIndex + 1}_h-${hIndex + 1}`} sx={{ fontSize: 12 }}>Select Hotel*</InputLabel>
								<HotelSearchFree
									selectedHotel={selectedHotels[hIndex] || ''}
									onChange={(val) => handleHotelChange(hIndex, val)}
									userHotelRates={userHotelRates}
								/>
							</Grid>
							&nbsp;
							<Grid item xs={4}>
								<InputLabel id={`room-day${hIndex + 1}`} sx={{fontSize: 12}}>
									Location:
								</InputLabel>
								<TextField variant="outlined" size="small" 
									value={selectedHotels[hIndex]?.location || ''}
								/>
							</Grid>
						</Grid>
						{!isEmptyObject(hData["selectedRooms"]) && (<HotelRoomsView hotelIndex={hIndex} />)}
					</Grid>
					<Grid item xs={12} display={'flex'} flexDirection={'column'} sx={{mt: 0}}>
						<Button size="small" variant="outlined" onClick={generateItineraryDay1} sx={{ width: 'fit-content' }}>
							Generate Itinerary for Day {currentDayIndex + 1}
							{
								geminiLoading && <CircularProgress color="secondary" size="10px" sx={{ ml: 1 }}/>
							}
						</Button>
						{
							itineraryDesc[currentDayIndex]?.text && (<>
								<InputLabel id={'iti-desc'} sx={{ fontSize: 12 }}>Itinerary Description:</InputLabel>
								<Box sx={{ border: `1px solid`, borderColor: 'primary', borderRadius: 1, p: 1  }}>
									<small>{parse(itineraryDesc[currentDayIndex]?.text)}</small>
								</Box>
							</>)
						}
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
					<Typography variant="subtitle1" color="primary" sx={{ mb: 1, margin: 'auto' }}>Copy Details for: &nbsp;</Typography>
					<FormGroup row={true} sx={{ display: "flex" }}>
						{
							(daysArr || []).map((aa, aIndex) => {
								let dayNo = aIndex + 1;
								console.log("copy day render ", daysArr.length, aIndex, currentDayIndex, aa, Number(aIndex) > Number(currentDayIndex));
								if (aIndex > currentDayIndex) {
									return (<FormControlLabel
										control={<Checkbox />}
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