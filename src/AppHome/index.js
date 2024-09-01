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
import Autocomplete from '@mui/material/Autocomplete';
import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { nanoid } from 'nanoid';
import { useSelector, useDispatch } from 'react-redux';

import MainDestSelect from "./mainDestSearch.js";
import { MAX_CHILD_AGE, HOTEL_STAR_CAT_OPTS } from '../Constants.js'
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
  starCategory: ""
};

const requiredFields = [
  "destination",
  "adultPax",
  "noOfNights",
  "startDate",
  "trackingId",
  "starCategory"
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

	useEffect(() => {
		const fetchUserIdToken = async () => {
		  try {
			auth.onAuthStateChanged(async (user) => {
			  if (user) {
				// user.getIdToken().then(function(data) {
				//   console.log(data)
				// });
				let signedInIdToken = await auth.currentUser.getIdToken(
				  /* forceRefresh */ true,
				);
				console.log("signedInIdToken ", signedInIdToken);
			  }
			});
		  } catch (e) {
			console.log("signedInIdToken error ", e);
		  }
		};
	
		fetchUserIdToken();
	}, []);

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
		console.log("new Req post: ", reqData, childAges);
		// TODO: handle data validation, show validation errors

		let newReqId = nanoid();
		let newReqData = {...reqData, reqId: newReqId, childAges};
		dispatch(submitReqData({reqData: newReqData}));
		let reqRef = await setDoc(doc(db, "requests", newReqId), {
			...newReqData,
			reqId: newReqId,
			userId: userData?.phone,
			createdAt: Date.now()
		}, {merge: true});
		let userPackRef = await setDoc(doc(db, "userPackages", userData?.phone), {
			packagesList: arrayUnion(newReqId),
			updatedAt: Date.now()
		}, {merge: true});
		console.log("new Req post 2: ", reqData, newReqId, reqRef, userPackRef);
		// return;
		setTimeout(() => navigate("/itinerary/"+newReqId));
	}

	const handleChildAgeChange = (age, childIndex) => {
		console.log("child age change", age, childIndex, !isNaN(age), age > MAX_CHILD_AGE);
		if(isNaN(age)) return;
		if(age > MAX_CHILD_AGE) {
			// TODO: show error
			return;
		}
		let newChildAges = [...childAges];
		newChildAges[childIndex] = Number(age);
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
	        	<InputLabel id="noOfNights" error={formErrors["noOfNights"]} sx={{fontSize: 12}}>Total Nights*</InputLabel>
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
				<InputLabel id="adultPax" error={formErrors["adultPax"]} sx={{fontSize: 12}}>Total Adult Pax*</InputLabel>
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
	        <Grid item xs={4}>
	        	<InputLabel id="childPax" error={formErrors["childPax"]} sx={{fontSize: 12}}>Total Child Pax*</InputLabel>
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
							value={c}
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
	        <Grid item xs={4}>
				<Autocomplete
					disablePortal
					id="hotelStar"
					includeInputInList
					onChange={(e, val) =>{
						console.log("star change ", e, val)
						setReqData(prev => {
							return {...prev, "starCategory": val};
						})}
					}
					renderInput={(params) => (
						<TextField
							error={formErrors["starCategory"]}
							{...params}
							label="Hotel Category*"
							size="small"
							variant="outlined"
						/>
					)}
					options={HOTEL_STAR_CAT_OPTS}
					value={reqData.starCategory}
					defaultValue={""}
				/>
			</Grid>
	        
	        <Grid item xs={12} sx={{ display: "flex", flexDirection: "row-reverse" }}>
	        	<Button
			        sx={{ mt: 4, mb: 2, textAlign: "right" }}
			        loading={buttonLoading}
			        onClick={handlePost}
			        variant="contained"
					size="small"
			    >
			        Save Request&nbsp; >
			    </Button>
	        </Grid>
	    </Grid>
	</>)
}

export default AppHome;