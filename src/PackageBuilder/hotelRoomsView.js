import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import RadioGroup from '@mui/material/RadioGroup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector, useDispatch } from 'react-redux';

// import { isEmptyObject } from '../Utility.js';
import { handleRoomSelect, selectedRoomOccupancy, handleRemoveRoom, 
	setMealPlanFor1Room, setPriceFor1Room, setRoomOccChildAge } from './packBuilderSlice.js';
// import RoomSearchFree from "./roomSearchCommon.js";

import PackDetailsFor1Room from './packDetailsFor1Room.js';

const roomsList = [
	{
		name: "Deluxe"	
	},
	{
		name: "Penthouse"	
	},
]

const HotelRoomsBuilder = ({ hotelIndex = null }) => {
	const reqData = useSelector((state) => state.packBuilderData.reqData) || {};
	const currentDayIndex = useSelector((state) => state.packBuilderData.currDayIndex);
	const currDayHotels = useSelector((state) => state.packBuilderData.selectedHotels[currentDayIndex]?.hotels);
	const currDayhotelData = currDayHotels[hotelIndex];
	const selectedRooms = currDayhotelData.selectedRooms;
	const hotelRates = Object.values(currDayhotelData?.roomRates || {});
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const dispatch = useDispatch();

	console.log("hotel rooms render ", currentDayIndex, currDayhotelData, hotelIndex, hotelRates);
	// const handleRoomChange = (roomIndex, data) => {
	// 	// handleDataChange(dayIndex, data);
	// 	console.log("handleRoomChange ", hotelIndex, roomIndex, data)
	// 	dispatch(handleRoomSelect({hotelIndex, roomIndex, data}));
	// }

	// const handleOccChange = (e, rindex, keyType) => {
	// 	console.log("occ handleOccChange", e.target.value, keyType, rindex);
	// 	dispatch(selectedRoomOccupancy({
	// 		hotelIndex, 
	// 		roomIndex: rindex, 
	// 		keyType, 
	// 		value: e.target.value
	// 	}));
	// }

	// const handleOccChildAgeChange = (rindex, childIndex, age, extraBed = false) => {
	// 	console.log("handleOccChildAgeChange form ", rindex, childIndex, age, extraBed);
	// 	dispatch(setRoomOccChildAge({
	// 		hotelIndex, 
	// 		roomIndex: rindex,
	// 		childIndex,
	// 		age,
	// 		extraBed
	// 	}));
	// }
	
	// const handleMealPlanChange = (e, rindex) => {
	// 	const selectedMp = e.target.checked ? e.target.name : '';
	// 	console.log("handleMealPlanChange", e.target.checked, e.target.name, selectedMp);
	// 	dispatch(setMealPlanFor1Room({
	// 		hotelIndex, 
	// 		roomIndex: rindex,
	// 		mealPlan: selectedMp
	// 	}));
	// }

	const handleRoomPriceChange = (e, rIndex) => {
		const roomPrice = e.target.value;
		console.log("handleMealPlanChange",  hotelIndex, rIndex, roomPrice);
		dispatch(setPriceFor1Room({
			hotelIndex, 
			roomIndex: rIndex,
			roomPrice
		}));
	}

	console.log("room builder render HotelRoomView", currDayhotelData, selectedRooms, hotelRates);
	console.log("ROOMDATA", hotelRates[0]?.occupancy?.child)
	return (<Grid container spacing={2} sx={{padding: 2}}>
		{
			(selectedRooms || []).map((rItem, rindex) => {
				console.log("rItem render ", rItem, rindex);
				// let childAges = rItem?.selectedOccupancy?.childAges || [];
				return (<Grid item xs={12} sx={{ position: 'relative', border: '1px solid', borderRadius: '5px', my: 0.5 }}>
					{
						(rindex >= reqData?.roomOcc.length) && (<IconButton aria-label="delete" size="small" color="primary" 
						onClick={() => dispatch(handleRemoveRoom({hotelIndex, deleteIndex: rindex}))}
						sx={{ position: 'absolute', top: '0', right: '0' }}
					>
						<DeleteIcon fontSize='small'/>
					</IconButton>)}

					<PackDetailsFor1Room hotelIndex={hotelIndex} roomIndex={rindex} roomItem={rItem}  />
					
					{/* <Grid item xs={12}>
						<hr />
					</Grid> */}
					{/* <Grid item display={'flex'}>
						<Grid item xs={6} md={6}>
							<InputLabel id={`room-day${hotelIndex + 1}`} sx={{fontSize: 12}}>
								Room Price:
							</InputLabel>
							<TextField variant="outlined" type="number" size="small" 
								onChange={(e) => handleRoomPriceChange(e, rindex)} 
								value={rItem?.roomPrice} sx={{margin: "auto"}}
							/>
						</Grid>
						<Grid item xs={6} md={6} display={'flex'} justifyContent={'flex-end'}>
							<Button size="small" variant="outlined" onClick={handleAddRoom} sx={{ my: 'auto' }}>Add Room +</Button>
						</Grid>
					</Grid> */}
				</Grid>)
			})
		}
	</Grid>)
}

export default HotelRoomsBuilder;