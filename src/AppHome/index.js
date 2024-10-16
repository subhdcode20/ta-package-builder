import React, { useState, useEffect } from 'react';
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
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { nanoid } from 'nanoid';
import { useSelector, useDispatch } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';


import MainDestSelect from "./mainDestSearch.js";
import { MAX_CHILD_AGE, HOTEL_STAR_CAT_OPTS } from '../Constants.js'
import { db, auth } from "../firebaseConfig";
import { submitReqData } from "../PackageBuilder/packBuilderSlice.js";
import LoadingButton from '../Commons/LoadingButton.jsx';
import { isEmptyObject } from '../Utility.js';
import { CabTypes } from "../Constants.js"

const initialFormData = {
	destination: "",
	adultPax: "",
	childPax: "",
	noOfNights: "",
	pickUp: "",
	startDate: "",
	trackingId: "",
	starCategory: "",
	noOfRooms: '',
	cabType: "",
};

const requiredFields = [
	"destination",
	"adultPax",
	"noOfNights",
	"startDate",
	"trackingId",
	"starCategory",
	"noOfRooms",
	"pickUp",
	"cabType",
];

const AppHome = ({ isUpdateflow = false, requestData = null, copyNew = false }) => {
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
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

	useEffect(() => {
		if (requestData) {
			setReqData(requestData);
			setStartDate(new Date(requestData.startDate));
			setChildAges(requestData.childAges || []);
			setDestination(requestData.destination || '');
		}
		if (requestData && copyNew) {
			requestData.trackingId = "";
		}
	}, [requestData]);

	const handleDestSelect = (e) => {
		let selectedDest = e?.target?.value;
		if (!selectedDest) return;
		console.log("selectedDest req ", selectedDest);
		// setDestination(selectedDest);
		setReqData(prev => {
			return { ...prev, destination: selectedDest }
		})
	};

	const handleFormChange = (e, field) => {
		let val = e.target.value;
		console.log("form change 1 ", val, field);
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
		console.log("set childages ", reqData.childPax, typeof reqData.childPax, isNaN(reqData.childPax));
		let newChildPax = reqData.childPax || 0;
		if (isNaN(reqData.childPax)) return;
		let newChildAges = [];
		let len = childAges.length;
		for (let ii = 0; ii < newChildPax; ii++) {
			if (!isEmptyObject(childAges[ii])) {
				newChildAges.push({ ...childAges[ii] });
			} else {
				newChildAges.push({ age: null, extraBed: false });
			}
		}
		console.log("child age effect ", reqData.childPax, childAges.map(i => `${i.age}-${i.extraBed}`), newChildAges)
		setChildAges(newChildAges);
	}, [reqData.childPax])

	const handlePost = async () => {
		setButtonLoading(true);
		console.log("new Req post: ", reqData, childAges);
		// TODO: handle data validation, show validation errors

		let newReqId = nanoid();
		let newReqData = { ...reqData, reqId: newReqId, childAges };
		dispatch(submitReqData({ reqData: newReqData }));
		let reqRef = await setDoc(doc(db, "requests", newReqId), {
			...newReqData,
			reqId: newReqId,
			userId: userData?.phone,
			createdAt: Date.now()
		}, { merge: true });

		let userPackRef = await setDoc(doc(db, "userRequests", userData?.phone), {
			reqsList: arrayUnion(newReqId),
			updatedAt: Date.now()
		}, { merge: true });

		console.log("new Req post 2: ", reqData, newReqId, reqRef); //, userPackRef
		// return;
		// if (copyNew) {
		// 	setTimeout(() => navigate(`/request/${newReqId}/copy-new`));
		// }
		// else {
		setTimeout(() => navigate("/itinerary/" + newReqId));
		// }
		setButtonLoading(false);
	}
	
	const handleUpdatePost = async () => {
		setButtonLoading(true);
		console.log("Updating Request: ", reqData, childAges);

		let updatedFields = {};

		if (reqData.noOfNights !== requestData.noOfNights) {
			updatedFields.noOfNights = reqData.noOfNights;
		}
		if (reqData.adultPax !== requestData.adultPax) {
			updatedFields.adultPax = reqData.adultPax;
		}
		if (reqData.childPax !== requestData.childPax) {
			updatedFields.childPax = reqData.childPax;
		}

		if (reqData.starCategory !== requestData.starCategory) {
			updatedFields.starCategory = reqData.starCategory;
		}
		if (reqData.destination !== requestData.destination) {
			updatedFields.destination = reqData.destination;
		}
		if (reqData.cabType !== requestData.cabType) updatedFields.cabType = reqData.cabType;
		if (reqData.noOfRooms !== requestData.noOfRooms) updatedFields.noOfRooms = reqData.noOfRooms;
		updatedFields.childAges = childAges;

		if (Object.keys(updatedFields).length > 0 || childAges.length > 0) {
			updatedFields.updatedAt = Date.now();
			dispatch(submitReqData({ reqData }));
			await updateDoc(doc(db, "requests", requestData.reqId), updatedFields);
			console.log("Updated fields: ", updatedFields);
		} else {
			console.log("No changes detected, nothing to update.");
		}
		setTimeout(() => navigate("/itinerary/" + requestData.reqId));
		setButtonLoading(false);
	}
	const handleChildAgeChange = (age, childIndex, extraBedValue = false) => {
		console.log("child age change", age, typeof age, Number(age), "---", childIndex, !isNaN(age), age > MAX_CHILD_AGE);
		console.log("MAXAGE: ", MAX_CHILD_AGE, childIndex, age);
		if (isNaN(age)) return;
		if (age > MAX_CHILD_AGE) {
			// TODO: show error
			return;
		}
		if(age == 0) age = ''
		console.log("PREVIOUSAGE", childAges);
		let newChildAges = [ ...childAges ];
		// if (newChildAges.length < childIndex) {
		// 	for (let i = newChildAges.length; i <= childIndex; i++) {
		// 		newChildAges[i] = null;
		// 	}
		// }
		newChildAges[childIndex] = {
			age: age,
			extraBed: extraBedValue
		};
		console.log("NEWCHILDRENAGES", newChildAges);
		setChildAges(newChildAges);
	}

	const handleChildExtraBedChange = (e, childIndex) => {
		console.log("child extra bed type ", e.target.value);
	}

	console.log("child home render ", reqData.childPax, childAges, storeReqData)
	console.log("DESTINATION", destination)
	return (
		<Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", mt: 2 }}>
			<Box maxWidth={'md'} sx={{ border: "2px solid #ccc", borderRadius: 4, padding: isMobile ? 1 : 3, bgcolor: "transparent" }}>
				<Box sx={{ "display": "flex", mb: 2 }}>
					<Typography variant="h6" sx={{ margin: 'auto' }}>
						<b>{(isUpdateflow) ? `Update Request` : `Create New Request`}</b>
					</Typography>
				</Box>

				<Grid container spacing={2} sx={{ padding: isMobile ? 1 : 5 }}>
					<Grid item xs={6} md={3} lg={3}>
						<MainDestSelect handleDestSelect={handleDestSelect} destination={destination} />
						{/* <br /> */}
					</Grid>
					
					<Grid item xs={12}>
						<InputLabel id="trackingId" error={formErrors["trackingId"]} sx={{ fontSize: 12 }}>Lead Pax Name*</InputLabel>
						<TextField
							error={formErrors["trackingId"]}
							sx={{ width: "100%" }}
							id="trackingId"
							value={reqData.trackingId || ''}
							variant="outlined"
							size="small"
							onChange={!isUpdateflow ? ((e) => handleFormChange(e, "trackingId")) : undefined}
						/>
					</Grid>
					<Grid item xs={6} md={3} lg={3}>
						<InputLabel id="noOfNights" error={formErrors["noOfNights"]} sx={{ fontSize: 12 }}>Total Nights*</InputLabel>
						<TextField
							error={formErrors["noOfNights"]}
							sx={{ width: "100%" }}
							id="noOfNights"
							variant="outlined"
							size="small"
							value={reqData.noOfNights || ''}
							onChange={(e) => handleFormChange(e, "noOfNights")}
							inputProps={{
								type: "number",
							}}
						/>
					</Grid>
					<Grid item xs={6} md={3} lg={3}>
						<InputLabel id="adultPax" error={formErrors["adultPax"]} sx={{ fontSize: 12 }}>Total Adult Pax*</InputLabel>
						<TextField
							error={formErrors["adultPax"]}
							sx={{ width: "100%" }}
							id="adultPax"
							variant="outlined"
							size="small"
							value={reqData.adultPax || ''}
							onChange={(e) => handleFormChange(e, "adultPax")}
							inputProps={{
								type: "number",
							}}
						/>
					</Grid>
					<Grid item xs={6} md={3} lg={3}>
						<InputLabel id="childPax" error={formErrors["childPax"]} sx={{ fontSize: 12 }}>Total Child Pax*</InputLabel>
						<TextField
							error={formErrors["childPax"]}
							sx={{ width: "100%" }}
							id="childPax"
							variant="outlined"
							size="small"
							value={reqData.childPax || ''}
							onChange={(e) => handleFormChange(e, "childPax")}
							inputProps={{
								type: "number",
							}}
						/>
					</Grid>

					
					{
						childAges.length > 0 && (<Grid container spacing={5} sx={{ padding: isMobile ? 4 : 4 }}>
							{childAges.map((c, cIndex) => {
								return (
									<Grid item xs={12} md={6} lg={6} >
										<Grid container spacing={1}>
											<Grid item xs={6} md={6} lg={6}>
												<InputLabel id="childPax" error={formErrors["childPax"]} sx={{ fontSize: 12 }}>{`Child ${cIndex + 1} Age*`}</InputLabel>
												<TextField
													error={formErrors["childPax"]}
													sx={{ width: "100%" }}
													id={`childPax-${cIndex}${Number(c.age)}`}
													variant="outlined"
													size="small"
													onChange={(e) => handleChildAgeChange(e.target.value || '', cIndex)}
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
													onChange={(e) => handleChildAgeChange(c?.age, cIndex, Boolean(e.target.value))}
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
					<Grid item xs={6}>
						<InputLabel id="cabType" error={formErrors["cabType"]} sx={{ fontSize: 12 }}>Cab Type*</InputLabel>
						<Autocomplete
							disablePortal
							id="cabType-filter"
							includeInputInList
							onChange={(e, val) => handleFormChange({ target: { value: val } }, "cabType")}
							renderInput={(params) => (
								<TextField
									{...params}
									error={formErrors["cabType"]}
									variant="outlined"
									size="small"
								/>
							)}
							options={CabTypes}
							value={reqData.cabType}
							defaultValue={reqData.cabType}
							sx={{ width: "100%" }}
						/>
					</Grid>
					<Grid item xs={6} sx={{ display: "flex", flexDirection: "column" }}>
						<InputLabel id="startDate" error={formErrors["startDate"]} sx={{ fontSize: 12 }}>{"Start Date*"}</InputLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<MobileDatePicker
								fullWidth
								size="small"
								onChange={(newValue) => {
									let timestamp = Date.parse(new Date(newValue));
									setReqData(prev => {
										return { ...prev, startDate: timestamp };
									});
								}}
								sx={{ width: "100%" }}
								value={reqData.startDate || ''}
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

					<Grid item xs={6}>
						<InputLabel id="hotelStar" error={formErrors["hotelStar"]} sx={{ fontSize: 12 }}>Hotel Category*</InputLabel>
						<Autocomplete
							disablePortal
							id="hotelStar"
							includeInputInList
							onChange={(e, val) => {
								setReqData(prev => {
									return { ...prev, "starCategory": val };
								});
							}}
							renderInput={(params) => (
								<TextField
									error={formErrors["starCategory"]}
									{...params}
									variant="outlined"
								/>
							)}
							options={HOTEL_STAR_CAT_OPTS}
							value={reqData.starCategory}
							defaultValue={""}
						/>
					</Grid>

					<Grid item xs={6} md={4}>
						<InputLabel id="trackingId" error={formErrors["trackingId"]} sx={{ fontSize: 12 }}>Lead Pax Name*</InputLabel>
						<TextField
							error={formErrors["trackingId"]}
							sx={{ width: "100%" }}
							id="trackingId"
							value={reqData.trackingId || ''}
							variant="outlined"
							size="small"
							onChange={(!isUpdateflow) && ((e) => handleFormChange(e, "trackingId"))}
						/>
					</Grid>

					<Grid item xs={6} md={4}>
						<InputLabel id="trackingId" error={formErrors["noOfRooms"]} sx={{ fontSize: 12 }}>No of Rooms*</InputLabel>
						<TextField
							error={formErrors["noOfRooms"]}
							sx={{ width: "100%" }}
							id="noOfRooms"
							value={reqData.noOfRooms || ''}
							variant="outlined"
							size="small"
							onChange={(e) => handleFormChange(e, "noOfRooms")}
							inputProps={{
								type: "number",
							}}
						/>
					</Grid>
					<Grid item xs={6} md={4}>
						<InputLabel id="trackingId" error={formErrors["noOfRooms"]} sx={{ fontSize: 12 }}>PickUp*</InputLabel>
						<TextField
							error={formErrors["pickUp"]}
							sx={{ width: "100%" }}
							id="pickUp"
							value={reqData.pickUp || ''}
							variant="outlined"
							size="small"
							onChange={(e) => handleFormChange(e, "pickUp")}
							inputProps={{
								type: "number",
							}}
						/>
					</Grid>

					<Grid item xs={12} sx={{ display: "flex", flexDirection: "row-reverse" }}>
						{isUpdateflow ? (
							<LoadingButton
								sx={{ mt: 4, mb: 2, textAlign: "right" }}
								loading={buttonLoading}
								onClick={handleUpdatePost}
								variant="contained"
								size="small"
							>
								Update Request&nbsp;
							</LoadingButton>
						) : (
							<LoadingButton
								sx={{ mt: 4, mb: 2, textAlign: "right" }}
								loading={buttonLoading}
								onClick={handlePost}
								variant="contained"
								size="small"
							>
								Save Request&nbsp;
							</LoadingButton>
						)}
					</Grid>
				</Grid>
			</Box>
		</Box>
	)
}

export default AppHome;