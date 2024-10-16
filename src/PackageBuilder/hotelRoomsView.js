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
import RadioGroup from '@mui/material/RadioGroup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector, useDispatch } from 'react-redux';

import { isEmptyObject } from '../Utility.js';
import { addNewRoomToHotel, handleRoomSelect, selectedRoomOccupancy, 
	setMealPlanFor1Room, setPriceFor1Room, setRoomOccChildAge } from './packBuilderSlice.js';
import RoomSearchFree from "./roomSearchCommon.js";

const roomsList = [
	{
		name: "Deluxe"	
	},
	{
		name: "Penthouse"	
	},
]

const HotelRoomsBuilder = ({ hotelIndex = null }) => {
	// const [roomsData, setRoomsData] = useState([
	// 	{
	// 		key: `H-${dayIndex + 1}-R-${0}`
	// 	}
	// ]);
	const currentDayIndex = useSelector((state) => state.packBuilderData.currDayIndex);
	const currDayHotels = useSelector((state) => state.packBuilderData.selectedHotels[currentDayIndex]?.hotels);
	const currDayhotelData = currDayHotels[hotelIndex];
	const selectedRooms = currDayhotelData.selectedRooms;
	const roomsData = Object.values(currDayhotelData?.roomRates || {});
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const dispatch = useDispatch();

	console.log("hotel rooms render ", currentDayIndex, currDayhotelData, hotelIndex, roomsData);
	const handleRoomChange = (roomIndex, data) => {
		// handleDataChange(dayIndex, data);
		console.log("handleRoomChange ", hotelIndex, roomIndex, data)
		dispatch(handleRoomSelect({hotelIndex, roomIndex, data}));
	}

	const handleAddRoom = () => {
		dispatch(addNewRoomToHotel({hotelIndex}));
	}

	const handleOccChange = (e, rindex, keyType) => {
		console.log("occ handleOccChange", e.target.value, keyType, rindex);
		dispatch(selectedRoomOccupancy({
			hotelIndex, 
			roomIndex: rindex, 
			keyType, 
			value: e.target.value
		}));
	}

	const handleOccChildAgeChange = (rindex, childIndex, age, extraBed = false) => {
		console.log("handleOccChildAgeChange form ", rindex, childIndex, age, extraBed);
		dispatch(setRoomOccChildAge({
			hotelIndex, 
			roomIndex: rindex,
			childIndex,
			age,
			extraBed
		}));
	}
	
	const handleMealPlanChange = (e, rindex) => {
		const selectedMp = e.target.checked ? e.target.name : '';
		console.log("handleMealPlanChange", e.target.checked, e.target.name, selectedMp);
		dispatch(setMealPlanFor1Room({
			hotelIndex, 
			roomIndex: rindex,
			mealPlan: selectedMp
		}));
	}

	const handleRoomPriceChange = (e, rIndex) => {
		const roomPrice = e.target.value;
		console.log("handleMealPlanChange",  hotelIndex, rIndex, roomPrice);
		dispatch(setPriceFor1Room({
			hotelIndex, 
			roomIndex: rIndex,
			roomPrice
		}));
	}

	console.log("room builder render HotelRoomView", currDayhotelData, selectedRooms, roomsData);
	console.log("ROOMDATA", roomsData[0]?.occupancy?.child)
	return (<Grid container spacing={2} sx={{padding: 2}}>
		{
			(selectedRooms || []).map((rItem, rindex) => {
				console.log("rItem render ", rItem, rindex);
				let childAges = rItem?.selectedOccupancy?.childAges || [];
				return (<Grid item xs={12}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4} lg={4}>
							<InputLabel id={`room_H-${hotelIndex + 1}`} sx={{fontSize: 12}}>
								&nbsp;&nbsp;{`Select Room ${rindex + 1}*`} 
							</InputLabel>
							
							<RoomSearchFree 
								selectedRoom={ selectedRooms[rindex] || null } 
								onChange={(val) => handleRoomChange(rindex, val)}  
								userRoomRates={roomsData}
							/>
							{/* <Autocomplete
						      fullWidth
						      size="small"
						      value={ rItem || null }
						      onChange={(event, newValue) => {
						      	 console.log("hotel selected", newValue)
						         handleRoomChange(rindex, newValue);
						      }}
						      selectOnFocus
						      clearOnBlur
						      handleHomeEndKeys
						      id="hotel-name"
						      options={roomsData}
						      getOptionLabel={(option) => {
						        console.log("hotel getOptionLabel ", option, typeof option);
						        // Regular option
						        return option.roomName;
						      }}
						      renderOption={(props, option) => {
						        console.log("maindest renderOption ", props, option);
						        const { key, ...optionProps } = props;
						        return (
						          <li key={key} {...optionProps}>
						            {option.roomName}
						          </li>
						        );
						      }}
						      renderInput={(params) => (
						        <TextField {...params} sx={{fontSize: 12, m: 0, padding: 0}} />
						      )}
						    /> */}
						</Grid>
						<Grid item xs={6} md={2} lg={2}>
							<InputLabel id={`room-day${hotelIndex + 1}`} sx={{fontSize: 12}}>
								Adults:
							</InputLabel>
							<TextField variant="outlined" type="number" size="small" 
								onChange={(e) => handleOccChange(e, rindex, "adults")} 
								value={rItem?.selectedOccupancy?.adults}
							/>
						</Grid>
						<Grid item xs={6} md={2} lg={2}>
							<InputLabel id={`room-day${hotelIndex + 1}`} sx={{fontSize: 12}}>
								Children:
							</InputLabel>
							<TextField variant="outlined" type="number" size="small" 
								onChange={(e) => handleOccChange(e, rindex, "child")} 
								value={ rItem?.selectedOccupancy?.child}
							/>
						</Grid>
				    </Grid>
					{
						childAges.length > 0 && (<Grid container spacing={5} sx={{ padding: isMobile ? 4 : 4 }}>
							{childAges.map((c, cIndex) => {
								console.log("childAges room details", c, cIndex)
								return (
									<Grid item xs={12} md={6} lg={6} >
										<Grid container spacing={1}>
											<Grid item xs={6} md={6} lg={6}>
												<InputLabel id="childPax" sx={{ fontSize: 12 }}>{`Child ${cIndex + 1} Age*`}</InputLabel>
												<TextField
													sx={{ width: "100%" }}
													id={`childPax-${cIndex}${Number(c.age)}`}
													variant="outlined"
													size="small"
													onChange={(e) => handleOccChildAgeChange(rindex, cIndex, e.target.value, c.extraBed)}
													inputProps={{
														type: "number",
													}}
													value={c.age}
													type="text"
												/>
											</Grid>
											<Grid item xs={6} md={6} lg={6}>
												{
													Number(c.age) >= 5 && (<RadioGroup
													aria-labelledby="demo-radio-buttons-group-label"
													defaultValue="false"
													name="radio-buttons-group"
													onChange={(e) => handleOccChildAgeChange(rindex, cIndex, c.age, e.target.value)}
												>
													<FormControlLabel value="false" control={<Radio size="small" defaultChecked />} label="Without Bed" />
													<FormControlLabel value="true" control={<Radio size="small"  />} label="With Bed" />
												</RadioGroup>)}
											</Grid>
										</Grid>
									</Grid>
								);
							})}
						</Grid>)
					}

					<Grid item xs={12}>
						<InputLabel id={`room-mp-day${hotelIndex + 1}`} sx={{fontSize: 12, mt: 2}}>
							Room Meal Plan:
						</InputLabel>
						<FormGroup sx={{ display: "flex", flexDirection: "row" }}>
							<FormControlLabel
								control={
									<Checkbox checked={rItem?.mp == "mapai"} onChange={(e) => handleMealPlanChange(e, rindex)} name="mapai" />
								}
								label="MAPAI"
							/>
							<FormControlLabel
								control={
									<Checkbox checked={rItem?.mp == "cpai"} onChange={(e) => handleMealPlanChange(e, rindex)} name="cpai" />
								}
								label="CPAI"
							/>
							<FormControlLabel
								control={
									<Checkbox checked={rItem?.mp == "apai"} onChange={(e) => handleMealPlanChange(e, rindex)} name="apai" />
								}
								label="APAI"
							/>
						</FormGroup>
					</Grid>
					<Grid item display={'flex'}>
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
					</Grid>
				</Grid>)
			})
		}
	</Grid>)
}

export default HotelRoomsBuilder;