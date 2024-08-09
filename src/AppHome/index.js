import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { nanoid } from 'nanoid';
import { useSelector, useDispatch } from 'react-redux';

import MainDestSelect from "./mainDestSearch.js";
import { MAX_CHILD_AGE } from '../Constants.js'
import { db, auth } from "../firebaseConfig";
import { submitReqData } from "../PackageBuilder/packBuilderSlice.js";

const initialFormData = {
  destination: "",
  adultPax: "",
  childPax: "",
  noOfNights: "",
  pickUp: "",
  startDate: "",
  trackingId: "",
};

const requiredFields = [
  "destination",
  "adultPax",
  "noOfNights",
  "startDate",
  "trackingId",
];

const AppHome = () => {
	const [destination, setDestination] = useState("");
	const [reqData, setReqData] = useState({ ...initialFormData, destination });
	const [childAges, setChildAges] = useState([]);
	const [postSaved, setPostSaved] = useState(false);
	const userData = JSON.parse(localStorage.getItem("user"));
	const navigate = useNavigate();
	const [startDate, setStartDate] = useState("");
	const [showAlertData, setAlertOpen] = useState({ show: false });
	const [pickUp, setPickUp] = useState([]);
	const [formErrors, setFormErrors] = useState({});
	const [buttonLoading, setButtonLoading] = useState(false);
	const dispatch = useDispatch();
	const storeReqData = useSelector((state) => state.packBuilderData.reqData) || {};

	const handleDestSelect = (e) => {
	    let selectedDest = e?.target?.value;
	    if(!selectedDest) return;
	    console.log("selectedDest req ", selectedDest);
	    // setDestination(selectedDest);
		setReqData(prev => { 
			return {...prev, destination: selectedDest}
		})
	};

	const handleFormChange = (e, field) => {
	    console.log("form change 1 ", e, field);
	    let val = e.target.value;
	    // setAlertOpen({ show: false });

	    let req = { ...reqData };

	    // set value after validation
	    req[field] = val;
	    setReqData(req);
	 };

	const handlePickUpSelect = (val) => {
	    handleFormChange({ target: { value: val } }, "pickUp");
	};

	useEffect(() => {
		if(!reqData.childPax || reqData.childPax <= 0) return;
		let newChildAges = [];
		for(let ii = 0; ii < reqData.childPax; ii++) {
			newChildAges.push(null);
		}
		console.log("child age effect ", reqData.childPax, newChildAges)
		setChildAges(newChildAges);
	}, [reqData.childPax])

	const handlePost = async () => {
		console.log("new Req post: ", reqData);
		// TODO: handle data validation, show validation errors

		let newReqId = nanoid();
		let newReqData = {...reqData, reqId: newReqId};
		dispatch(submitReqData({reqData: newReqData}));
		let docRef = await setDoc(doc(db, "requests", newReqId), newReqData);
		console.log("new Req post 2: ", reqData, docRef);
		// return;
		setTimeout(() => navigate("/itinerary/"+newReqId));
	}

	const handleChildAgeChange = (age, childIndex) => {
		if(!age || !childIndex) return;
		if(age > MAX_CHILD_AGE) {
			// TODO: show error
			return;
		}
		let newChildAges = [...childAges];
		newChildAges[childIndex] = age;
		setChildAges(newChildAges);
	}

	console.log("child home render ", childAges, storeReqData)
	return (<>
		<Box sx={{"display": "flex", mb: 2}}>
			<Typography variant="h6" sx={{margin: 'auto'}}><b>Create New Itinerary</b></Typography>
		</Box>
		<MainDestSelect handleDestSelect={handleDestSelect} destination={destination} />
		<br />
		<Grid container spacing={2}>
			<Grid item xs={6}>
	        	<InputLabel id="noOfNights" error={formErrors["noOfNights"]} sx={{fontSize: 12}}>No Of Nights*</InputLabel>
				<TextField
					error={formErrors["noOfNights"]}
					sx={{ width: "100%" }}
					id="noOfNights"
					variant="outlined"
					size="small"
					onChange={(e) => handleFormChange(e, "noOfNights")}
					inputProps={{
						type: "number",
					}}
				/>
	        </Grid>
			<Grid item xs={6}>
				<InputLabel id="adultPax" error={formErrors["adultPax"]} sx={{fontSize: 12}}>Adult Pax*</InputLabel>
	            <TextField
					error={formErrors["adultPax"]}
					sx={{ width: "100%" }}
					id="adultPax"
					variant="outlined"
					size="small"
					onChange={(e) => handleFormChange(e, "adultPax")}
					inputProps={{
					type: "number",
					}}
	            />
	        </Grid>
	        <Grid item xs={3}>
	        	<InputLabel id="childPax" error={formErrors["childPax"]} sx={{fontSize: 12}}>Child Pax*</InputLabel>
				<TextField
					error={formErrors["childPax"]}
					sx={{ width: "100%" }}
					id="childPax"
					variant="outlined"
					size="small"
					onChange={(e) => handleFormChange(e, "childPax")}
					inputProps={{
						type: "number",
					}}
				/>
	        </Grid>	
				
			{
				childAges.map((c, cIndex) => {
					return (<Grid item xs={3}>
						<InputLabel id="childPax" error={formErrors["childPax"]} sx={{fontSize: 12}}>{`Child ${cIndex + 1} Age*`}</InputLabel>
						<TextField
							error={formErrors["childPax"]}
							sx={{ width: "100%" }}
							id="childPax"
							variant="outlined"
							size="small"
							onChange={(e) => handleChildAgeChange(e.target.value, cIndex)}
							inputProps={{
								type: "number",
							}}
						/>
					</Grid>)
				})
			}

	        <Grid item xs={12} sx={{ display: "flex", flexDirection: "column" }}>
	        	<InputLabel id="startDate" error={formErrors["startDate"]} sx={{fontSize: 12}}>{"Start Date*"}</InputLabel>
		        <LocalizationProvider dateAdapter={AdapterDateFns}>
		            <MobileDatePicker
		              fullWidth
		              onChange={(newValue) => {
		                let timestamp = Date.parse(new Date(newValue));
		                console.log("startDate value: ", newValue, timestamp);
						setReqData(prev => {
							return {...prev, startDate: timestamp}
						})
		                // setStartDate(formattedVal);
		              }}
		              sx={{ width: "100%" }}
		              size="small"
		              closeOnSelect
		              className={"date-picker-root"}
		              renderInput={(params) => (
		                <TextField
		                  error={formErrors["startDate"]}
		                  fullWidth
		                  size="small"
		                  id="start-date"
		                  label="Start Date"
		                  variant="outlined"
		                  {...params}
		                />
		              )}
		            />
		        </LocalizationProvider>
	        </Grid>
	        {/* <Grid item xs={12} sx={{ display: "flex" }}>
	        		        	<Autocomplete
	        			            disablePortal
	        			            id="pickUp"
	        			            includeInputInList
	        			            onChange={(e, val) =>
	        			              handleFormChange({ target: { value: val } }, "pickUp")
	        			            }
	        			            renderInput={(params) => (
	        			              <TextField
	        			                error={formErrors["pickUp"]}
	        			                {...params}
	        			                label="Pick Up*"
	        			                size="small"
	        			                variant="outlined"
	        			              />
	        			            )}
	        			            options={pickUpOpts}
	        			            value={reqData.pickUp}
	        			            defaultValue={""}
	        		        	/>
	        		        </Grid> */}
	        
	        <Grid item xs={12} sx={{ display: "flex", flexDirection: "row-reverse" }}>
	        	<Button
			        sx={{ mt: 4, mb: 2, width: "40%", textAlign: "right" }}
			        loading={buttonLoading}
			        onClick={handlePost}
			        variant="contained"
			    >
			        Save Request&nbsp; >
			    </Button>
	        </Grid>
	    </Grid>
	</>)
}

export default AppHome;