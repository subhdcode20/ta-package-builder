import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import { useSelector, useDispatch } from 'react-redux';

import { isEmptyObject } from '../Utility.js';
import { addNewRoomToHotel } from './packBuilderSlice.js';

const roomsList = [
	{
		name: "Deluxe"	
	},
	{
		name: "Penthouse"	
	},
]

const HotelRoomsBuilder = ({ hotelIndex = null, addRoomsDataToHotelData }) => {
	// const [roomsData, setRoomsData] = useState([
	// 	{
	// 		key: `H-${dayIndex + 1}-R-${0}`
	// 	}
	// ]);
	const currentDayIndex = useSelector((state) => state.packBuilderData.currDayIndex);
	const hotelData = useSelector((state) => state.packBuilderData.selectedHotels[currentDayIndex][hotelIndex]);
	const roomsData = hotelData?.selectedRooms || [];
	const dispatch = useDispatch();

	const handleRoomChange = (data) => {
		// handleDataChange(dayIndex, data);
	}

	const handleAddRoom = () => {
		dispatch(addNewRoomToHotel({hotelIndex}));
		// let newRData = [...roomsData];
		// newRData.push({
		// 	key: `H-${dayIndex + 1}-R-${roomsData.length + 1}`
		// });
		// setRoomsData(newRData);
	}

	console.log("room builder render ", hotelData, hotelData.selectedRooms, roomsData);
	return (<Grid container spacing={2} sx={{padding: 2}}>
		{
			(hotelData?.selectedRooms || []).map((rItem, rindex) => {
				return (<Grid item xs={12}>
					<Grid container spacing={2}>
						<Grid item xs={4}>
							<InputLabel id={`room_H-${hotelIndex + 1}`} sx={{fontSize: 12}}>
								&nbsp;&nbsp;{`Select Room ${rindex + 1}*`}
							</InputLabel>
							<Autocomplete
						      fullWidth
						      size="small"
						      value={ rItem.name || null }
						      onChange={(event, newValue) => {
						      	 console.log("hotel selected", newValue)
						         handleRoomChange(newValue);
						      }}
						      selectOnFocus
						      clearOnBlur
						      handleHomeEndKeys
						      id="hotel-name"
						      options={roomsList}
						      getOptionLabel={(option) => {
						        console.log("hotel getOptionLabel ", option, typeof option);
						        // Regular option
						        return option.name;
						      }}
						      renderOption={(props, option) => {
						        console.log("maindest renderOption ", props, option);
						        const { key, ...optionProps } = props;
						        return (
						          <li key={key} {...optionProps}>
						            {option.name}
						          </li>
						        );
						      }}
						      renderInput={(params) => (
						        <TextField {...params} sx={{fontSize: 12, m: 0, padding: 0}} />
						      )}
						    />
						</Grid>
						<Grid item xs={2}>
							<InputLabel id={`room-day${hotelIndex + 1}`} sx={{fontSize: 12}}>
								Adults:
							</InputLabel>
							<TextField variant="outlined" type="number" size="small" />
						</Grid>
						<Grid item xs={2}>
							<InputLabel id={`room-day${hotelIndex + 1}`} sx={{fontSize: 12}}>
								Children:
							</InputLabel>
							<TextField variant="outlined" type="number" size="small" />
						</Grid>
				    </Grid>
				</Grid>)
			})
		}
		<Grid item xs={12}>
			<Button size="small" variant="outlined" onClick={handleAddRoom}>Add Room +</Button>
		</Grid>
	</Grid>)
}

export default HotelRoomsBuilder;