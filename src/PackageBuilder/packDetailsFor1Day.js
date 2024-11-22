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
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import CircularProgress from '@mui/material/CircularProgress';
import parse from "html-react-parser";
import useMediaQuery from '@mui/material/useMediaQuery';
import InputAdornment from '@mui/material/InputAdornment';
import { nanoid } from 'nanoid';

import HotelRoomsView from "./hotelRoomsView.js";
import { isEmptyObject } from '../Utility.js';
import { store } from '../appStore/store.js';
import HotelSearchFree from "./hotelSearchCommon.js";
import { 
	handleHotelSelect, addNewHotelToCurrDay, setHotelPriceForCurrDay, submitReqData,
	setItineraryDesc, setHotelLocation, addNewRoomToHotel, updateItineraryDesc } from './packBuilderSlice.js'; //setUserHotelRates
import { db, auth } from "../firebaseConfig";
import { GenerateItineraryBtn } from "./geminiComponents.js";
import { useParams } from "react-router-dom";
import SavePackagePdf from "./savePackagePdf.js";

const bull = (
	<Box
		component="span"
		sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
	>•</Box>
);

const PackageDetailsFor1Day = ({ key }) => {
	const currentDayIndex = useSelector((state) => state.packBuilderData.currDayIndex);
	const selectedHotels = useSelector((state) => state.packBuilderData.selectedHotels);
	const currDayHotels = selectedHotels[currentDayIndex]?.hotels;
	const daysArr = useSelector((state) => state.packBuilderData.daysArr) || [];
	const reqData = useSelector((state) => state.packBuilderData.reqData) || {};
	const userData = useSelector((state) => state.packBuilderData.userData) || {};
	const totalDayPrices = useSelector((state) => state.packBuilderData.totalDayPrices) || [];
	const itineraryDesc = useSelector((state) => state.packBuilderData.itineraryDesc) || [];
	// const userHotelRates = useSelector((state) => state.packBuilderData.hotelRates) || [];
	const [userHotelRates, setUserHotelRates] = useState([]);
	const [selectedDaysToCopyDetails, setSelectedDaysToCopyDetails] = useState({});
	// const [geminiLoading, setGeminiLoading] = useState(false);
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const dispatch = useDispatch();
	const currDayPrice = totalDayPrices[currentDayIndex]?.totalPrice || '';
	console.log("pack day daya ", userHotelRates, currentDayIndex, currDayHotels, totalDayPrices, currDayPrice);
	console.log("userHotelRates", userHotelRates, "\ncurrentDayIndex", currentDayIndex, "\nselectedHotels", currDayHotels, "\ntotalDayPrices", totalDayPrices, "\ncurrDayPrice", currDayPrice);
	const { reqId } = useParams();
	
	// useEffect(() => {
	// 	if (!reqData || !reqData?.destination || !userData?.phone) return;
	// 	console.log("reqtest- get Hotel rates", reqData, userData);
	// 	const getUserHotelRates = async () => {
	// 		const { destination } = reqData || {};
	// 		console.log("reqtest- getUserHotelRates reducer", destination, userData?.phone);
	// 		if (!destination || !userData?.phone) return; // TODO show page error
	// 		let docName = `${userData?.phone}-${destination.toLowerCase()}`;
	// 		let docSnap = await getDoc(doc(db, "userRates", docName));
	// 		if (docSnap.exists()) {
	// 			let ratesData = docSnap.data();
	// 			console.log("reqtest- user hotel rates data ", ratesData);
	// 			// setBookingPartnerDetails(docSnap.data());
	// 			// setReqData(docSnap.data());
	// 			// state.hotelRates = ratesData?.hotels || [];
	// 			// dispatch(setUserHotelRates({ ratesData }));
	// 			if (ratesData?.hotels) setUserHotelRates(ratesData?.hotels);
	// 		} else {
	// 			console.error(`reqtest- user hotel rates not forund for ${docName}`);
	// 			// TODO show page error
	// 			// return null;
	// 		}
	// 	}

	// 	getUserHotelRates()
	// }, [reqData, userData])

	const getUserHotelRates = async (hotelLoc = '') => {
		const { destination } = reqData || {};
		console.log("reqtest- getUserHotelRates reducer", destination, hotelLoc, userData?.phone);
		if (!hotelLoc || !userData?.phone) return; // TODO show page error
		let docName = `${userData?.phone}-${destination.toLowerCase()}`;
		let docSnap = await getDoc(doc(db, "userRates", docName));
		if (docSnap.exists()) {
			let ratesData = docSnap.data();
			let locHotels = ratesData?.hotels.filter((i, index) => i.location.toLowerCase() == hotelLoc.toLowerCase())
			console.log("reqtest- user hotel rates data ", locHotels, ratesData);

			if (ratesData?.hotels) setUserHotelRates(locHotels || ratesData?.hotels);
		} else {
			console.error(`reqtest- user hotel rates not forund for ${docName}`);
			// TODO show page error
			// return null;
		}
	}

	const handleLocationSelect = async ({hotelIndex, data}) => {
		dispatch(setHotelLocation({hotelIndex, data}));
		if(data.length > 3) await getUserHotelRates(data);
	}

	const handleHotelChange = (hotelIndex, data) => {
		console.log('save day daya handleHotelChange', hotelIndex, data);
		// handleDataChange(hotelIndex, data);
		dispatch(handleHotelSelect({ hotelIndex, data }));
	}

	const addHoteltoCurrDay = () => {
		console.log("addHoteltoCurrDay");
		dispatch(addNewHotelToCurrDay());
	}

	const updatePriceFor1Day = async (newPrice = '') => {
		dispatch(setHotelPriceForCurrDay({
			totalHotelPriceForCurrDay: newPrice,
			copyDetailsToDays: []
		}));
	}

	const checkPricefor1Day = async () => {
		let totalHotelPriceForCurrDay = currDayHotels.reduce((acc, h) => {
			let totalRoomsPriceForCurrHotel = h.selectedRooms.reduce((rAcc, r) => {
				let { mp = null, roomPrice = null, selectedOccupancy = {}, stdRoomPrice = {}, extraRates = {} } = r;
				console.log("checkPricefor1Day 1Hotel 1Room", rAcc + Number(roomPrice), mp, roomPrice, selectedDaysToCopyDetails);
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
		console.log("checkPricefor1Day", totalHotelPriceForCurrDay, currDayHotels, selectedDaysToCopyDetails);
		return totalHotelPriceForCurrDay;
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

	const handleAddRoom = (hIndex) => {
		dispatch(addNewRoomToHotel({hotelIndex: hIndex}));
	}

	// const generateItineraryDay1 = async () => {
	// 	console.log(reqData, currDayHotels, 'gemRes -- ');
	// 	setGeminiLoading(true);
	// 	let gemRes = await aiHotelDetails({ reqData, selectedHotels, currentDayIndex });
	// 	setGeminiLoading(false);
	// 	dispatch(setItineraryDesc({ text: gemRes }));
	// }

	// const handleItiDescChange = (itiDesc, itiDescIndex) => {
	// 	if(!itiDesc) return;
	// 	dispatch(updateItineraryDesc({ itiDesc, itiDescIndex }));
	// }

	const handleDayPriceChange = () => {}

	const handleDropLocChange = (val = '') => {
		let newReqData = { ...reqData };
		newReqData["dropLoc"] = val;
		dispatch(submitReqData({ reqData: newReqData }));
	}

	const handleSaveDayPrice = async () => {
		// let finalCurrDayPrice = ''
		// if(totalDayPrices[currentDayIndex]?.totalPrice) finalCurrDayPrice = totalDayPrices[currentDayIndex]?.totalPrice;
		// else 
		let autoCalCurrDayPrice = await checkPricefor1Day()
		let finalCurrDayPrice = totalDayPrices[currentDayIndex]?.totalPrice || autoCalCurrDayPrice;
		console.log('finalCurrDayPrice ', finalCurrDayPrice, totalDayPrices[currentDayIndex]?.totalPrice, autoCalCurrDayPrice);
		dispatch(setHotelPriceForCurrDay({
			totalHotelPriceForCurrDay: finalCurrDayPrice,
			selectedHotelCurrDay: currDayHotels,
			copyDetailsToDays: selectedDaysToCopyDetails
		}));
	}

	// console.log("SELECTEDHOTEL:", currDayHotels, currDayHotels[0]);
	return (<Grid container spacing={1} key={key}>
		{
			(currDayHotels || []).map((hData = [], hIndex) => {
				console.log('day hotels inside render ', hData, currDayHotels[hIndex])
				
				if(currentDayIndex >= daysArr.length - 1) {
					return (<>
						<Grid item xs={4} md={4}>
							<InputLabel id="trackingId" sx={{ fontSize: 12 }}>Drop location</InputLabel>
							<TextField
								sx={{ width: "100%" }}
								id="pickUp"
								value={reqData.dropLoc || ''}
								variant="outlined"
								size="small"
								onChange={(e) => handleDropLocChange(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12} md={12} sx={{ display: 'flex' }}>
							<GenerateItineraryBtn />
						</Grid>
					</>);
				}
			})
		}

		{
			currentDayIndex < daysArr.length - 1 && (<>
				{
					(currDayHotels || []).map((hData = [], hIndex) => {
						return (<Grid item xs={12}>
							<Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>Hotel {`${hIndex + 1}`}</Typography>
							<Grid container spacing={1}>
								<Grid item xs={12} display={'flex'} justifyContent={'space-between'}>
									<Grid item xs={4}>
										<InputLabel id={`room-day${hIndex + 1}`} sx={{ fontSize: 12 }}>
											Location:
										</InputLabel>
										<TextField variant="outlined" size="small" onChange={(e) => handleLocationSelect({hotelIndex: hIndex, data: e.target.value})}
											value={currDayHotels[hIndex]?.location || ''}
										/>
									</Grid>
									&nbsp;
									<Grid item xs={8} md={8}>
										<InputLabel id={`d-${currentDayIndex + 1}_h-${hIndex + 1}`} sx={{ fontSize: 12 }}>Select Hotel*</InputLabel>
										<HotelSearchFree
											selectedHotel={currDayHotels[hIndex] || ''}
											onChange={(val) => handleHotelChange(hIndex, val)}
											userHotelRates={userHotelRates}
										/>
									</Grid>
								</Grid>
								{
									!isEmptyObject(hData["selectedRooms"]) && (<Grid item xs={12} display={'flex'} flexDirection={'column'}>
										<HotelRoomsView hotelIndex={hIndex} />
										{/* <Grid item xs={6} md={6} display={'flex'} justifyContent={'flex-end'}>
											<Button size="small" variant="outlined" onClick={() => handleAddRoom(hIndex)} sx={{ my: 'auto' }}>Add Room +</Button>
										</Grid> */}
									</Grid>)
								}
							</Grid>
							<Grid item xs={4} display={'flex'} flexDirection={isMobile ? 'column' : 'row'} justifyContent={'space-between'} >
								<Button size="small" variant="outlined" sx={{ my: 'auto', mb: 1, width: 'fit-content' }}
									onClick={() => handleAddRoom(hIndex)} 
								>Add Room +</Button>
								
								
								{/* <Button size="small" variant="contained" onClick={generateItineraryDay1} sx={{ width: 'fit-content' }}>
									Generate Itinerary for Day {currentDayIndex + 1}
									{
										geminiLoading && <CircularProgress color="secondary" size="10px" sx={{ ml: 1 }} />
									}
								</Button>
								<Grid item xs={12} display={'flex'} flexDirection={'column'} sx={{ mt: 1 }}>
									{
										itineraryDesc[currentDayIndex]?.text && (<Box sx={{ border: `1px solid`, borderColor: 'primary', borderRadius: 1, p: 1 }}>
											<InputLabel id={'iti-desc'} sx={{ fontSize: 12 }}>Itinerary Description:</InputLabel>
											{
												itineraryDesc[currentDayIndex]?.text.map((itiText, itiTextIndex) => {
													return (<Box sx={{ display: 'flex', p: 1 }}>
														{bull} &nbsp;
														<TextField
															sx={{ width: "100%" }}
															id=""
															value={itiText || ''}
															variant="standard"
															multiline
															size="small"
															onChange={(e) => handleItiDescChange(e.target.value, itiTextIndex)}
														/>
													</Box>)
												})
											}
										</Box>)
									}
								</Grid> */}
							</Grid>
							{/* <Grid item xs={12} display={'flex'} flexDirection={'column'} justifyContent={'center'} sx={{ mt: isMobile ? 1 : -4 }}>
								<GenerateItineraryBtn />
							</Grid> */}
							
							{/* <Grid item xs={12}>
								<hr />
							</Grid> */}
						</Grid>)
					})
				}
				
				<GenerateItineraryBtn />

				<Grid item xs={12}>
					<Box display="flex" flexDirection={isMobile ? "column" : "row"} justifyContent="flex-end" sx={{ my: 1 }}>
						<Grid item xs={6} md={6}>
							<InputLabel id={`room-day${currentDayIndex + 1}`} sx={{fontSize: 12}}>
								Total Price for Day {currentDayIndex + 1}:
							</InputLabel>
							<TextField variant="outlined" type="number" size="small" 
								InputProps={{
									startAdornment: (
									  <InputAdornment position="start">Rs. </InputAdornment>
									),
								}}
								onChange={(e) => updatePriceFor1Day(e.target.value)} 
								value={currDayPrice} sx={{margin: "auto"}}
							/>
						</Grid>
						{
							(currentDayIndex < daysArr.length - 2) && (<Box display="flex" sx={{ pl: 1 }}>
							<Box style={{ display: 'flex' }}>
								<Typography variant="caption" color="primary" sx={{ margin: 'auto', mr: 1 }}>Copy Hotel Details for: &nbsp;</Typography>
							</Box>
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
						</Box>)}
						{
							Object.values(selectedDaysToCopyDetails).some(i => i) && (<Box display={'flex'}>
								<Button size="small" variant="contained" onClick={handleSaveDayPrice} sx={{ minWidth: "fit-content", my: 'auto' }}>Save & Next</Button>
							</Box>)
						}
					</Box>
				</Grid>
			</>)
		}
		{/* <Grid item xs={12}>
			<Typography variant="body1" sx={{ m: 1 }}>Total Day {currentDayIndex + 1} Price - <b>Rs {currDayPrice}</b></Typography>
		</Grid> */}
	</Grid>)
}

export default PackageDetailsFor1Day;