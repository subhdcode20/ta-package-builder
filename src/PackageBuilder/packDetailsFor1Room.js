
import React, { useEffect, useState } from "react";
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
import { handleRoomSelect, selectedRoomOccupancy, handleRemoveRoom, calculatePriceFor1Day, 
	setMealPlanFor1Room, setPriceFor1Room, setRoomOccChildAge } from './packBuilderSlice.js';
import RoomSearchFree from "./roomSearchCommon.js";

const PackDetailsFor1Room = ({ hotelIndex, roomIndex, roomItem,  }) => {
    const currentDayIndex = useSelector((state) => state.packBuilderData.currDayIndex);
	const currDayHotels = useSelector((state) => state.packBuilderData.selectedHotels[currentDayIndex]?.hotels);
	const currDayhotelData = currDayHotels[hotelIndex];
	const selectedRooms = currDayhotelData.selectedRooms;
	const roomsData = Object.values(currDayhotelData?.roomRates || {});
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const dispatch = useDispatch();
    let { roomPrice = '', selectedOccupancy = {} } = roomItem;
    let childAges = selectedOccupancy?.childAges || [];
    
    useEffect(() => {
        if(roomPrice) dispatch(calculatePriceFor1Day());
    }, [roomPrice])

	const handleRoomChange = (roomIndex, data) => {
		// handleDataChange(dayIndex, data);
		console.log("handleRoomChange ", hotelIndex, roomIndex, data)
		dispatch(handleRoomSelect({hotelIndex, roomIndex, data}));
	}

    const handleOccChange = (e, roomIndex, keyType) => {
		console.log("occ handleOccChange", e.target.value, keyType, roomIndex);
		dispatch(selectedRoomOccupancy({
			hotelIndex, 
			roomIndex: roomIndex, 
			keyType, 
			value: e.target.value
		}));
	}

	const handleOccChildAgeChange = (roomIndex, childIndex, age, extraBed = false) => {
		console.log("handleOccChildAgeChange form ", roomIndex, childIndex, age, extraBed);
		dispatch(setRoomOccChildAge({
			hotelIndex, 
			roomIndex: roomIndex,
			childIndex,
			age,
			extraBed
		}));
	}
	
	const handleMealPlanChange = (e, roomIndex) => {
		const selectedMp = e.target.checked ? e.target.name : '';
		console.log("handleMealPlanChange", e.target.checked, e.target.name, selectedMp);
		dispatch(setMealPlanFor1Room({
			hotelIndex, 
			roomIndex: roomIndex,
			mealPlan: selectedMp
		}));
	}

    return (<>
        <Grid container spacing={2}>
            <Grid item xs={12} md={4} lg={4}>
                <Box display={"flex"} flexDirection={'row'}>
                    <InputLabel id={`room_H-${hotelIndex + 1}`} sx={{fontSize: 12, my: 'auto'}}>
                        &nbsp;&nbsp;{`Select Room ${roomIndex + 1}*`} 
                    </InputLabel>
                </Box>
                
                <RoomSearchFree 
                    selectedRoom={ selectedRooms[roomIndex] || null } 
                    onChange={(val) => handleRoomChange(roomIndex, val)}  
                    userRoomRates={roomsData}
                />
            </Grid>
            <Grid item xs={6} md={2} lg={2}>
                <InputLabel id={`room-day${hotelIndex + 1}`} sx={{fontSize: 12}}>
                    Adults:
                </InputLabel>
                <TextField variant="outlined" type="number" size="small" 
                    onChange={(e) => handleOccChange(e, roomIndex, "adults")} 
                    value={roomItem?.selectedOccupancy?.adults}
                />
            </Grid>
            <Grid item xs={6} md={2} lg={2}>
                <InputLabel id={`room-day${hotelIndex + 1}`} sx={{fontSize: 12}}>
                    Children:
                </InputLabel>
                <TextField variant="outlined" type="number" size="small" 
                    onChange={(e) => handleOccChange(e, roomIndex, "child")} 
                    value={ roomItem?.selectedOccupancy?.child}
                />
            </Grid>
        </Grid>
        {
            childAges.length > 0 && (<Grid container spacing={3} sx={{ pt: 3, pl: 2 }}>
                {childAges.map((c, cIndex) => {
                    console.log("childAges room details", c, cIndex)
                    return (
                        <Grid item xs={12} md={6} lg={6} sx={{ pl: '8px !important', pt: '8px !important' }}>
                            <Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <Grid item xs={5} sx={{ mb: 3, mx: 1 }}>
                                    <InputLabel id="childPax" sx={{ fontSize: 12 }}>{`Child ${cIndex + 1} Age*`}</InputLabel>
                                    <TextField
                                        sx={{ width: "100%" }}
                                        id={`childPax-${cIndex}${Number(c.age)}`}
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => handleOccChildAgeChange(roomIndex, cIndex, e.target.value, c.extraBed)}
                                        inputProps={{
                                            type: "number",
                                        }}
                                        value={c.age}
                                        type="text"
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="false"
                                        name="radio-buttons-group"
                                        onChange={(e) => handleOccChildAgeChange(roomIndex, cIndex, c.age, e.target.value)}
                                    >
                                        <FormControlLabel value="false" control={<Radio size="small" defaultChecked />} label="Without Bed" />
                                        <FormControlLabel value="true" control={<Radio size="small" disabled={Number(c.age) <= 5} />} label="With Bed" />
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                        </Grid>
                    );
                })}
            </Grid>)
        }

        <Grid item xs={12}>
            <InputLabel id={`room-mp-day${hotelIndex + 1}`} sx={{fontSize: 12, mt: 1}}>
                Room Meal Plan:
            </InputLabel>
            <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
                <FormControlLabel
                    control={
                        <Checkbox size="small" checked={roomItem?.mp == "mapai"} onChange={(e) => handleMealPlanChange(e, roomIndex)} name="mapai" />
                    }
                    label="MAPAI"
                />
                <FormControlLabel
                    control={
                        <Checkbox size="small" checked={roomItem?.mp == "cpai"} onChange={(e) => handleMealPlanChange(e, roomIndex)} name="cpai" />
                    }
                    label="CPAI"
                />
                <FormControlLabel
                    control={
                        <Checkbox size="small" checked={roomItem?.mp == "apai"} onChange={(e) => handleMealPlanChange(e, roomIndex)} name="apai" />
                    }
                    label="APAI"
                />
            </FormGroup>
        </Grid>
    </>)
}

export default PackDetailsFor1Room;