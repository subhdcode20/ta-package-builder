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
import useMediaQuery from '@mui/material/useMediaQuery';

import HotelRoomsView from "./hotelRoomsView.js";
import { isEmptyObject } from '../Utility.js';
import { store } from '../appStore/store.js';
import HotelSearchFree from "./hotelSearchCommon.js";
import { handleHotelSelect, addNewHotelToCurrDay, setHotelPriceForCurrDay, setItineraryDesc, setHotelLocation } from './packBuilderSlice.js'; //setUserHotelRates
import { db, auth } from "../firebaseConfig";
import { aiHotelDetails } from "./geminiComponents.js";

const bull = (
	<Box
	  component="span"
	  sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
	>•</Box>
  );

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
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
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
			let docSnap = await getDoc(doc(db, "userRates", docName));
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
		console.log('save day daya handleHotelChange', hotelIndex, data);
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
				console.log("checkPricefor1Day 1Hotel 1Room", rAcc + Number(roomPrice, mp, roomPrice, selectedOccupancy, selectedHotels, selectedDaysToCopyDetails));
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

	console.log("SELECTEDHOTEL:", selectedHotels, selectedHotels[0]);
	return (<Grid container spacing={1} key={key}>
		{
			(selectedHotels || []).map((hData = [], hIndex) => {
				console.log('day hotels inside render ', hData, selectedHotels[hIndex])
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
								<TextField variant="outlined" size="small" onChange={(e) => dispatch(setHotelLocation({ hotelIndex: hIndex, data: e.target.value }))}
									value={selectedHotels[hIndex]?.location || ''}
								/>
							</Grid>
						</Grid>
						{!isEmptyObject(hData["selectedRooms"]) && (<HotelRoomsView hotelIndex={hIndex} />)}
					</Grid>
					<Grid item xs={12} display={'flex'} flexDirection={'column'} sx={{my: 2}}>
						<Button size="small" variant="outlined" onClick={generateItineraryDay1} sx={{ width: 'fit-content' }}>
							Generate Itinerary for Day {currentDayIndex + 1}
							{
								geminiLoading && <CircularProgress color="secondary" size="10px" sx={{ ml: 1 }}/>
							}
						</Button>
						&nbsp;
						{
							itineraryDesc[currentDayIndex]?.text && (<Box sx={{border: `1px solid`, borderColor: 'primary', borderRadius: 1, p: 1}}>
								<InputLabel id={'iti-desc'} sx={{ fontSize: 12 }}>Itinerary Description:</InputLabel>
								{
									itineraryDesc[currentDayIndex]?.text.map((itiText) => {
										return (<Box sx={{ p: 1  }}>
											{bull} <small>{parse(itiText)}</small>
										</Box>)
									}) 
								}
							</Box>)
						}
					</Grid>
					<Grid item xs={12}>
						<hr />
					</Grid>
				</Grid>)
			})
		}

		<Grid item xs={12}>
			<Box display="flex" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between">
				<Box display={'flex'}>
					<Button size="small" variant="outlined" onClick={addHoteltoCurrDay} sx={{ minWidth: "fit-content", my: 'auto' }}>Add Hotel +</Button>
				</Box>
				<Box display="flex" sx={{ pl: 2 }}>
					<div style={{display: 'flex'}}><Typography variant="caption" color="primary" sx={{ mb: 1, margin: 'auto' }}>Copy Details for: &nbsp;</Typography></div>
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
				<Box display={'flex'}>
					<Button size="small" variant="contained" onClick={checkPricefor1Day} sx={{ minWidth: "fit-content", my: 'auto' }}>Save</Button>
				</Box>
			</Box>
		</Grid>
		<Grid item xs={12}>
			<Typography variant="body1" sx={{m: 1}}>Total Day {currentDayIndex + 1} Price - <b>Rs {currDayPrice}</b></Typography>
		</Grid>
	</Grid>)
}

export default PackageDetailsFor1Day;