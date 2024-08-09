import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useSelector, useDispatch } from 'react-redux';

import PackDetailsFor1Day from "./packDetailsFor1Day.js";
import { DayWiseItineraryContext } from "../Utility.js";
import { onCurrDayIndexChange, createEmptyPackageDataDayWise, handleHotelSelect } from './packBuilderSlice.js';

const DayWiseTabs = ({reqDatass = {}}) => {
	// const [currentDayIndex, setCurrentDayIndex] = useState(0);
	// const [daysArray, setDaysArray] = useState([]);
	// const [selectedHotels, setSelectedHotels] = useState([]);
	const reqData = useSelector((state) => state.packBuilderData.reqData) || {};
	const currentDayIndex = useSelector((state) => state.packBuilderData.currDayIndex);
	const daysArray = useSelector((state) => state.packBuilderData.daysArr);
	const dispatch = useDispatch();

	const { noOfNights = 1 } = reqData;

  	const handleChange = (event, newValue) => {
    	dispatch(onCurrDayIndexChange(newValue));
  	};

  	useEffect(() => {
  		console.log("initial nights value ", noOfNights)
  		dispatch(createEmptyPackageDataDayWise({noOfNights}));
  		// let newDaysArr = [], newHotelsArr = [];
  		// for(let ii = 0; ii < noOfNights+1; ii++) {
  		// 	newDaysArr.push({
  		// 		name: `Day ${ii}`
  		// 	});
  		// 	newHotelsArr.push(null);
  		// }
  		// setDaysArray(newDaysArr);
  		// setSelectedHotels(newHotelsArr);
  	}, [noOfNights])

  	// const handleDataChange = (hotelIndex, data) => {
  	// 	console.log("handleDataChange ", hotelIndex, data);
  	// 	dispatch(handleHotelSelect({hotelIndex, data}));
  	// 	// setSelectedHotels(prev => {
  	// 	// 	let newData = [...prev];
  	// 	// 	newData[dayIndex] = data;
  	// 	// 	return newData;
  	// 	// })
  	// } 

	const contextValue = {
		currentDayIndex
	}

  	console.log("reqtest- tabs render ", reqData, noOfNights, currentDayIndex, daysArray);
	return (<DayWiseItineraryContext.Provider value={contextValue}>
		<AppBar position="static">
	        <Tabs
	          value={currentDayIndex}
	          onChange={handleChange}
	          indicatorColor="secondary"
	          textColor="inherit"
	          variant="fullWidth"
	          aria-label="day wise tabs"
	        >
	          { daysArray.map((i, index) => <Tab label={`Day ${index + 1}`}  />)}
	        </Tabs>
	    </AppBar>
	    <br />
	    {
			(daysArray && daysArray.length > 0) && (<Card container>
	    	<CardContent>
			    <PackDetailsFor1Day 
			    	key={`day-${currentDayIndex}`} 
			    />
			</CardContent>
	    </Card>)}
	</DayWiseItineraryContext.Provider>)
}

export default DayWiseTabs;