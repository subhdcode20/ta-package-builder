import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useSelector, useDispatch } from 'react-redux';
import PackDetailsFor1Day from "./packDetailsFor1Day.js";
import { DayWiseItineraryContext } from "../Utility.js";
import {
	onCurrDayIndexChange, createEmptyPackageDataDayWise, setTotalPackagePrice,
	setTotalTransferPrice
} from './packBuilderSlice.js';
import SavePackagePdf from './savePackagePdf.js';
import useTotalPackPrice from "./useTotalPackPrice.js";

const DayWiseTabs = ({ reqDatass = {} }) => {
	// const [currentDayIndex, setCurrentDayIndex] = useState(0);
	// const [daysArray, setDaysArray] = useState([]);
	// const [selectedHotels, setSelectedHotels] = useState([]);
	const reqData = useSelector((state) => state.packBuilderData.reqData) || {};
	const currentDayIndex = useSelector((state) => state.packBuilderData.currDayIndex);
	const daysArray = useSelector((state) => state.packBuilderData.daysArr);
	const finalTransferPrice = useSelector((state) => state.packBuilderData?.finalTransferPrice);
	const finalPackPrice = useSelector((state) => state.packBuilderData?.finalPackPrice);
	const totalPackPrice = useTotalPackPrice();
	const [showComponentPrices, setShowComponentPrices] = useState(false);

	const dispatch = useDispatch();

	const { noOfNights = 0, roomOcc = [] } = reqData;

	const handleChange = (event, newValue) => {
		dispatch(onCurrDayIndexChange(newValue));
	};

	useEffect(() => {
		console.log("initial nights value ", noOfNights)
		dispatch(createEmptyPackageDataDayWise({ noOfNights, roomOcc }));
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

	useEffect(() => {
		dispatch(setTotalPackagePrice({ totalPackPrice: totalPackPrice }));
	}, [totalPackPrice])

	const contextValue = {
		currentDayIndex
	}

	console.log("reqtest- tabs render ", reqData, noOfNights, currentDayIndex, daysArray, totalPackPrice);
	return (<div style={{ border: '1px solid', borderRadius: '5px' }}>
		<DayWiseItineraryContext.Provider value={contextValue}>
			<AppBar position="static">
				<Tabs
					value={currentDayIndex}
					onChange={handleChange}
					indicatorColor="secondary"
					textColor="inherit"
					variant="fullWidth"
					aria-label="day wise tabs"
					scrollButtons="auto"
				>
					{daysArray.map((i, index) => <Tab label={`Day ${index + 1}`} />)}
				</Tabs>
			</AppBar>
			{
				(daysArray && daysArray.length > 0) && (<Card container>
					<CardContent sx={{ pb: 1 }}>
						<PackDetailsFor1Day
							key={`day-${currentDayIndex}`}
						/>
					</CardContent>
				</Card>)
			}
			{/* <Typography variant="body1" sx={{m: 1}}>Total Package Price - <b>Rs {totalPackPrice}</b></Typography> */}

			{
				(currentDayIndex == daysArray.length - 1) && (<Box display={'flex'} flexDirection={'row'} justifyContent={'space-evenly'} flexWrap={'wrap'} sx={{ m: 1 }}>
					<FormControlLabel
						control={<Checkbox checked={showComponentPrices} onChange={(e) => setShowComponentPrices(e.target.checked)} inputProps={{ 'aria-label': 'controlled' }} />}
						label="Set Component Prices"
					/>
					{
						showComponentPrices && (<>
							<FormControlLabel
								control={<Checkbox checked={showComponentPrices} onChange={(e) => setShowComponentPrices(e.target.checked)} inputProps={{ 'aria-label': 'controlled' }} />}
								label="Set Component Prices"
							/>
							{
								showComponentPrices && (<>
									<Box display={'flex'} flexDirection={'column'} sx={{ m: 1 }}>
										<InputLabel htmlFor="total-pack-price-input" sx={{ fontSize: 12 }}>
											Total Transfer Price:
										</InputLabel>
										<TextField variant="outlined" type="number" size="small" id={`total-pack-price-input`}
											InputProps={{
												startAdornment: (<InputAdornment position="start">Rs. </InputAdornment>),
											}}
											onChange={(e) => dispatch(setTotalTransferPrice({ transferPrice: e.target.value }))}
											value={finalTransferPrice || ''} sx={{ margin: "auto" }}
										/>
									</Box>
									<Box display={'flex'} flexDirection={'column'} sx={{ m: 1 }}>
										<InputLabel htmlFor="total-pack-price-input" sx={{ fontSize: 12 }}>
											Sightseeing Cost:
										</InputLabel>
										<TextField variant="outlined" type="number" size="small" id={`total-pack-price-input`}
											InputProps={{
												startAdornment: (<InputAdornment position="start">Rs. </InputAdornment>),
											}}
											onChange={(e) => dispatch(setTotalTransferPrice({ transferPrice: e.target.value }))}
											value={finalTransferPrice || ''} sx={{ margin: "auto" }}
										/>
									</Box>
								</>)
							}
							<Box display={'flex'} flexDirection={'column'} sx={{ m: 1 }}>
								<InputLabel htmlFor="total-pack-price-input" sx={{ fontSize: 12 }}>
									Sightseeing Cost:
								</InputLabel>
								<TextField variant="outlined" type="number" size="small" id={`total-pack-price-input`}
									InputProps={{
										startAdornment: (<InputAdornment position="start">Rs. </InputAdornment>),
									}}
									onChange={(e) => dispatch(setTotalTransferPrice({ transferPrice: e.target.value }))}
									value={finalTransferPrice || ''} sx={{ margin: "auto" }}
								/>
							</Box>
						</>)
					}
					<Box display={'flex'} flexDirection={'column'} sx={{ m: 1 }}>
						<InputLabel htmlFor="total-pack-price-input" sx={{ fontSize: 12 }}>
							Total Package Price:
						</InputLabel>
						<TextField variant="outlined" type="number" size="small" id={`total-pack-price-input`}
							InputProps={{
								startAdornment: (<InputAdornment position="start">Rs. </InputAdornment>),
							}}
							onChange={(e) => dispatch(setTotalPackagePrice({ totalPackPrice: e.target.value }))}
							value={finalPackPrice || totalPackPrice || ''} sx={{ margin: "auto" }}
						/>
					</Box>
					<SavePackagePdf />
				</Box>)
			}
			{/* <div style={{marginLeft: '8px', marginBottom: '8px'}}><SavePackagePdf /></div> */}
		</DayWiseItineraryContext.Provider>
	</div>)
}

export default DayWiseTabs;