import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';

import PackDetailsFor1Day from "./packDetailsFor1Day.js";
import { DayWiseItineraryContext } from "../Utility.js";
import { onCurrDayIndexChange, createEmptyPackageDataDayWise, handleHotelSelect } from './packBuilderSlice.js';
import SavePackagePdf from './savePackagePdf.js';
import useTotalPackPrice from "./totalPriceBreakup.js";

const DayWiseTabs = ({reqDatass = {}}) => {
	// const [currentDayIndex, setCurrentDayIndex] = useSt	ate(0);
	// const [daysArray, setDaysArray] = useState([]);
	// const [selectedHotels, setSelectedHotels] = useState([]);
	const reqData = useSelector((state) => state.packBuilderData.reqData) || {};
	const currentDayIndex = useSelector((state) => state.packBuilderData.currDayIndex);
	const daysArray = useSelector((state) => state.packBuilderData.daysArr);
	const totalPackPrice = useTotalPackPrice();

	const dispatch = useDispatch();

	const { noOfNights = 0 } = reqData;

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

	const contextValue = {
		currentDayIndex
	}

  	console.log("reqtest- tabs render ", reqData, noOfNights, currentDayIndex, daysArray, totalPackPrice);
	return (<div style={{border: '1px solid', borderRadius: '5px'}}>
		<DayWiseItineraryContext.Provider value={contextValue}>
		<AppBar position="static">
	        <Tabs
	          value={currentDayIndex}
	          onChange={handleChange}
	          indicatorColor="secondary"
	          textColor="inherit"
	          variant="fullWidth"
	          aria-label="day wise tabs"
			  variant="scrollable"
			  scrollButtons="auto"
	        >
	          { daysArray.map((i, index) => <Tab label={`Day ${index + 1}`}  />)}
	        </Tabs>
	    </AppBar>
	    {
			(daysArray && daysArray.length > 0) && (<Card container>
				<CardContent>
					<PackDetailsFor1Day 
						key={`day-${currentDayIndex}`} 
					/>
				</CardContent>
			</Card>)
		}
		<Typography variant="body1" sx={{m: 1}}>Total Package Price - <b>Rs {totalPackPrice}</b></Typography>
		{/* <div style={{marginLeft: '8px', marginBottom: '8px'}}><SavePackagePdf /></div> */}
	</DayWiseItineraryContext.Provider>
	</div>)
}

export default DayWiseTabs;