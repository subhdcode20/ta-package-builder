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

import MainDestSelect from "./mainDestSearch.js";

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
	const [postSaved, setPostSaved] = useState(false);
	const userData = JSON.parse(localStorage.getItem("user"));
	const navigate = useNavigate();
	const [startDate, setStartDate] = useState("");
	const [showAlertData, setAlertOpen] = useState({ show: false });
	const [pickUp, setPickUp] = useState([]);
	const [formErrors, setFormErrors] = useState({});
	const [buttonLoading, setButtonLoading] = useState(false);

	const handleDestSelect = (e) => {
	    let selectedDest = e?.target?.value;
	    if(!selectedDest) return;
	    console.log("selectedDest req ", selectedDest);
	    setDestination(selectedDest);
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

	const handlePost = () => {
		console.log("new Req post: ", destination, reqData, startDate);

		navigate("/itinerary")
	}

	return (<>
		<Box sx={{"display": "flex", mb: 2}}>
			<Typography variant="h6" sx={{margin: 'auto'}}><b>Create New Itinerary</b></Typography>
		</Box>
		<MainDestSelect handleDestSelect={handleDestSelect} destination={destination} />
		<br />
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<InputLabel id="adultPax" error={formErrors["adultPax"]} sx={{fontSize: 12}}>Adult Pax*</InputLabel>
	          <TextField
	            error={formErrors["adultPax"]}
	            sx={{ width: "100%" }}
	            id="adultPax"
	            label="Adult Pax*"
	            variant="outlined"
	            size="small"
	            onChange={(e) => handleFormChange(e, "adultPax")}
	            inputProps={{
	              type: "number",
	            }}
	          />
	        </Grid>
	        <Grid item xs={12}>
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

	        <Grid item xs={12}>
	        		
	        </Grid>

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
	        <Grid item xs={12} sx={{ display: "flex", flexDirection: "column" }}>
	        	<InputLabel id="startDate" error={formErrors["startDate"]} sx={{fontSize: 12}}>{"Start Date*"}</InputLabel>
		        <LocalizationProvider dateAdapter={AdapterDateFns}>
		            <MobileDatePicker
		              fullWidth
		              onChange={(newValue) => {
		                let formattedVal = Date.parse(new Date(newValue));
		                console.log("startDate value: ", newValue, formattedVal);
		                setStartDate(formattedVal);
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
	        
	        <Grid item xs={12} sx={{ display: "flex" }}>
	        	<Button
			        sx={{ mt: 4, mb: 2, width: "40%" }}
			        loading={buttonLoading}
			        onClick={handlePost}
			        variant="contained"
			    >
			        Next: Day wise Itinerary&nbsp; >
			    </Button>
	        </Grid>
	    </Grid>
	</>)
}

export default AppHome;