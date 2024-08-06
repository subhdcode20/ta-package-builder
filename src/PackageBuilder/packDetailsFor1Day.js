import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';

import HotelRoomsView from "./hotelRoomsView.js";
import { isEmptyObject } from '../Utility.js';
import {store} from '../appStore/store.js';

const hotelsList = [
	{	
		name: "Le Meridian"
	},
	{
		name: "Pullman"
	}
]

const PackageDetailsFor1Day = ({key, handleDataChange}) => {
	const currentDayIndex = useSelector((state) => state.packBuilderData.currDayIndex);
	const selectedHotels = useSelector((state) => state.packBuilderData.selectedHotels[currentDayIndex]);
	console.log("pack day daya ", currentDayIndex, selectedHotels, store.getState());

	const handleHotelChange = (hotelIndex, data) => {
		handleDataChange(hotelIndex, data);
	}

	const addRoomsDataToHotelData = () => {

	}

	return (<Grid container spacing={1} key={key}>
		{
			(selectedHotels || []).map((hData = [], hIndex) => {
				return (<Grid item xs={12}>
					<p>Hotel {`${hIndex + 1}`}</p>
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
						      options={hotelsList}
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
						{ !isEmptyObject(hData["selectedRooms"]) && (<HotelRoomsView hotelIndex={hIndex} addRoomsDataToHotelData={addRoomsDataToHotelData} />)}
					</Grid>
				</Grid>)
			})
		}
		
		<Grid item xs={12}>
			<Button size="small" variant="outlined" onClick={() => {"a"}}>Add Hotel +</Button>
		</Grid>
	</Grid>)
}

export default PackageDetailsFor1Day;