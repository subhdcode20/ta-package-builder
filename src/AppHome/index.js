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
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useTheme } from '@mui/material/styles';

import MainDestSelect from "../Commons/mainDestSearch.js";
import { MAX_CHILD_AGE, HOTEL_STAR_CAT_OPTS } from '../Constants.js'
import { db, auth } from "../firebaseConfig";
import { submitReqData } from "../PackageBuilder/packBuilderSlice.js";
import LoadingButton from '../Commons/LoadingButton.jsx';
import { isEmptyObject } from '../Utility.js';
import { CabTypes, PACKAGE_TYPES } from "../Constants.js"
import SnackbarMsg from "../Commons/snackbarMsg";

const initialFormData = {
	packType: "package",
	destination: "",
	// adultPax: "",
	// childPax: "",
	noOfNights: "",
	pickUp: "",
	startDate: "",
	trackingId: "",
	starCategory: "",
	// noOfRooms: '',
	cabType: "",
	noOfCabs: ""
};

const requiredFields = [
	"destination",
	// "adultPax",
	"noOfNights",
	"startDate",
	"trackingId",
	"starCategory",
	// "noOfRooms",
	"pickUp",
	"cabType",
];

const AppHome = ({ isUpdateflow = false, requestData = null, copyNew = false }) => {
	const [destination, setDestination] = useState("");
	const [reqData, setReqData] = useState({ ...initialFormData, destination });
	// const [childAges, setChildAges] = useState([]);
	const [postSaved, setPostSaved] = useState(false);
	const userData = JSON.parse(localStorage.getItem("user"));
	const navigate = useNavigate();
	const [startDate, setStartDate] = useState("");
	const [showAlertData, setAlertOpen] = useState({ show: false });
	const [pickUp, setPickUp] = useState([]);
	const [formErrors, setFormErrors] = useState({});
	const [buttonLoading, setButtonLoading] = useState(false);
	const [roomOcc, setRoomOcc] = useState([
		{
			adultPax: '',
			childPax: '',
			childAges: []
		}
	]);
	const [showSnackbar, setShowSnackbar] = useState({open: false});
	const dispatch = useDispatch();
	const storeReqData = useSelector((state) => state.packBuilderData.reqData) || {};
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const theme = useTheme();

	useEffect(() => {
		if (copyNew && requestData) {
			requestData.trackingId = "";
		}
		if (requestData) {
			setReqData(requestData);
			// setStartDate(new Date(requestData.startDate));
			setRoomOcc(requestData.roomOcc || []);
			setDestination(requestData.destination || '');
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

	// const handlePickUpSelect = (val) => {
	// 	handleFormChange({ target: { value: val } }, "pickUp");
	// };

	// useEffect(() => {
	// 	console.log("set childages ", reqData.childPax, typeof reqData.childPax, isNaN(reqData.childPax));
	// 	let newChildPax = reqData.childPax || 0;
	// 	if (isNaN(reqData.childPax)) return;
	// 	let newChildAges = [];
	// 	let len = childAges.length;
	// 	for (let ii = 0; ii < newChildPax; ii++) {
	// 		if (!isEmptyObject(childAges[ii])) {
	// 			newChildAges.push({ ...childAges[ii] });
	// 		} else {
	// 			newChildAges.push({ age: null, extraBed: false });
	// 		}
	// 	}
	// 	console.log("child age effect ", reqData.childPax, childAges.map(i => `${i.age}-${i.extraBed}`), newChildAges)
	// 	setChildAges(newChildAges);
	// }, [reqData.noOfRooms])
	
	// useEffect(() => {
	// 	console.log("set childages ", reqData.childPax, typeof reqData.childPax, isNaN(reqData.childPax));
	// 	let newChildPax = reqData.childPax || 0;
	// 	if (isNaN(reqData.childPax)) return;
	// 	let newChildAges = [];
	// 	let len = childAges.length;
	// 	for (let ii = 0; ii < newChildPax; ii++) {
	// 		if (!isEmptyObject(childAges[ii])) {
	// 			newChildAges.push({ ...childAges[ii] });
	// 		} else {
	// 			newChildAges.push({ age: null, extraBed: false });
	// 		}
	// 	}
	// 	console.log("child age effect ", reqData.childPax, childAges.map(i => `${i.age}-${i.extraBed}`), newChildAges)
	// 	setChildAges(newChildAges);
	// }, [reqData.childPax])

	const handlePost = async () => {
		setButtonLoading(true);
		console.log("new Req post: ", reqData, roomOcc);
		// TODO: handle data validation, show validation errors
		try {
			let newReqId = nanoid();
			const { totalAdults = 0, totalChild = 0 } = roomOcc.reduce((acc, item) => {
				acc = {
					"totalAdults": acc.totalAdults += Number(item.adultPax),
					"totalChild": acc.totalChild += Number(item.childPax)
				}
				return acc;
			}, {
				"totalAdults": 0,
				"totalChild": 0,        
			})
			let newReqData = { ...reqData, roomOcc, totalAdults, totalChild };
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
			setShowSnackbar({open: true, message: 'Request created! Redirecting to Package pdf..', severity: 'success', });
			console.log("new Req post 2: ", reqData, newReqId, reqRef); //, userPackRef
			// return;
			// if (copyNew) {
			// 	setTimeout(() => navigate(`/request/${newReqId}/copy-new`));
			// }
			// else {
			setTimeout(() => navigate("/itinerary/" + newReqId), 1000);
			// }
			setButtonLoading(false);
		} catch (error) {
			setShowSnackbar({open: true, message: 'Request error! Please refresh and try again.', severity: 'error', });
		}
	}

	const handleUpdatePost = async () => {
		setButtonLoading(true);
		console.log("Updating Request: ", reqData, roomOcc);

		let updatedFields = {
			...reqData,
			roomOcc
		};

		// if (reqData.noOfNights !== requestData.noOfNights) {
		// 	updatedFields.noOfNights = reqData.noOfNights;
		// }
		// if (reqData.startDate !== requestData.startDate) {
		// 	updatedFields.startDate = reqData.startDate;
		// }
		// if (reqData.startDate !== requestData.startDate) {
		// 	updatedFields.startDate = reqData.startDate;
		// }
		// if (reqData.startDate !== requestData.startDate) {
		// 	updatedFields.startDate = reqData.startDate;
		// }

		// if (reqData.starCategory !== requestData.starCategory) {
		// 	updatedFields.starCategory = reqData.starCategory;
		// }
		// if (reqData.destination !== requestData.destination) {
		// 	updatedFields.destination = reqData.destination;
		// }
		// if (reqData.cabType !== requestData.cabType) updatedFields.cabType = reqData.cabType;
		// if (reqData.noOfCabs !== requestData.noOfCabs) updatedFields.noOfCabs = reqData.noOfCabs;
		// if (reqData.pickUp !== requestData.pickUp) updatedFields.pickUp = reqData.pickUp;
		// updatedFields.roomOcc = roomOcc;
		

		console.log("Updated fields req: ", Object.keys(updatedFields), roomOcc, Object.keys(updatedFields).length > 0 || roomOcc.length > 0);
		if (Object.keys(updatedFields).length > 0 || roomOcc.length > 0) {
			updatedFields.updatedAt = Date.now();
			try {
				dispatch(submitReqData({ reqData }));
				let updateRef = await setDoc(doc(db, "requests", requestData.reqId), {
					...updatedFields,
					updatedAt: Date.now()
				}, { merge: true });
				// updateDoc(doc(db, "requests", requestData.reqId), updatedFields);
				console.log("Updated fields: ", updatedFields, updateRef);
				// let userReqRef = await setDoc(doc(db, "userRequests", userData?.phone), {
				// 	// reqsList: arrayUnion(requestData.reqId),
				// 	updatedAt: Date.now()
				// }, { merge: true });
				// console.log("Updated fields userReqRef: ", userReqRef);
				setShowSnackbar({open: true, message: 'Request updated successfully. Redirecting to update Package pdf..', severity: 'success' });
				setTimeout(() => navigate("/itinerary/" + requestData.reqId), 1000);
			} catch (e) {
				setShowSnackbar({open: true, message: 'Error in updating Request. Please refresh and try again.', severity: 'error', });	
			}
		} else {
			console.log("No changes detected, nothing to update.");
			setShowSnackbar({open: true, message: 'No changes detected, nothing to update.', severity: 'error', });
		}
		setButtonLoading(false);
	}

	const handleChildAgeChange = (age, roomIndex, childIndex, extraBedValue = false) => {
		console.log("child age change", roomOcc, age, roomIndex, childIndex, extraBedValue);
		// console.log("MAXAGE: ", MAX_CHILD_AGE, childIndex, age);
		if (isNaN(age)) return;
		if (age > MAX_CHILD_AGE) {
			// TODO: show error
			return;
		}
		if (age == 0) age = ''
		let newRoomData = roomOcc.map((r, rIndex) => {
			console.log("child age change room", r, rIndex, r.childAges, Number(rIndex) === Number(roomIndex));
			if(Number(rIndex) === Number(roomIndex)) {
				// let newChildAges = r["childAges"] || [];
				// r.childAges.map((c, cIndex) => {
				// 	if(cIndex === childIndex) {
				// 		return 
				// 	} 
				// })
				return {
					...r,
					childAges: r.childAges.map((c, cIndex) => {
						if(Number(cIndex) === Number(childIndex)) {
							return {
								...c,
								age,
								extraBed: extraBedValue
							}
						} else return c 
					})
				}
			} else return r;
		})
		console.log("child age change 2 ", newRoomData);

		// let childRoom = r[roomIndex];
		// let newChildAges = childAges in childRoom ? [...childRoom["childAges"]] : [];
		// // if (newChildAges.length < childIndex) {
		// // 	for (let i = newChildAges.length; i <= childIndex; i++) {
		// // 		newChildAges[i] = null;
		// // 	}
		// // }
		// newChildAges[childIndex] = {
		// 	age: age,
		// 	extraBed: extraBedValue
		// };
		// console.log("NEWCHILDRENAGES", newChildAges);
		// // setChildAges(newChildAges);
		// childRoom["childAges"] = newChildAges;
		setRoomOcc(newRoomData);
	}

	const handleRoomOccChange = (e, rIndex, field) => {
		let val = e.target.value;
		if(isNaN(rIndex) || !field) return;
		console.log("room occ change ", typeof roomOcc, val, rIndex, field);
		let roomsData = [ ...roomOcc ];
		roomsData[rIndex][field] = val;
		if(field == "childPax") {
			let childAges = roomsData[rIndex]["childAges"] || []; 
			if (isNaN(val)) return;
			let newChildAges = [];
			// let len = childAges.length;
			for (let ii = 0; ii < val; ii++) {
				if (!isEmptyObject(childAges[ii])) {
					newChildAges.push({ ...childAges[ii] });
				} else {
					newChildAges.push({ age: null, extraBed: false });
				}
			}
			roomsData[rIndex]["childAges"] = newChildAges
		}
		console.log("room occ change 2 ", roomsData, val, rIndex, field);
		setRoomOcc(roomsData);
	} 

	const addRoomOcc = ( ) => {
		let newRoomsData = [ ...roomOcc ];
		newRoomsData.push({
			childPax: '',
			adultPax: '',
			childAges: []
		})
		setRoomOcc(newRoomsData);
	}

	const handleRemoveRoom = (deleteIndex) => {
		let newRoomsData = [ ...roomOcc ];
		newRoomsData.splice(deleteIndex, 1)
		setRoomOcc(newRoomsData);
	}

	const handleChildExtraBedChange = (e, childIndex) => {
		console.log("child extra bed type ", e.target.value);
	}

	console.log("child home render ", roomOcc, roomOcc.length > 0, reqData.childPax, storeReqData)
	console.log("DESTINATION", destination)
	return (<>
		<Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", mt: 2 }}>
			<Box maxWidth={'md'} sx={{ border: "2px solid #ccc", borderRadius: 4, padding: isMobile ? 1 : 2, bgcolor: "transparent" }}>
				<Box sx={{ "display": "flex", mb: 2 }}>
					<Typography variant="h6" sx={{ margin: 'auto' }}>
						<b>{(isUpdateflow) ? `Update Your Request` : `Create New Request`}</b>
					</Typography>
				</Box>

				{/* <Box sx={{ "display": "flex", mb: 2 }}>
					<FormControl>
						<FormLabel id="packTypeLabel" error={formErrors["packType"]} sx={{ fontSize: 12 }}>Package Type*</FormLabel>
						<RadioGroup
							row
							aria-labelledby="demo-controlled-radio-buttons-group"
							name="controlled-radio-buttons-group"
							value={reqData?.packType || ''}
							onChange={(e) => handleFormChange(e, "packType")}
						>
							<FormControlLabel value="package" control={<Radio />} label="Package" />
							<FormControlLabel value="hotels" control={<Radio />} label="Only Hotels" />
							<FormControlLabel value="transport" control={<Radio />} label="Only Transport" />
						</RadioGroup>
					</FormControl>
				</Box> */}

				<Grid container spacing={2} sx={{ padding: isMobile ? 1 : 1 }}>
					<Grid item xs={12}>
						<FormControl>
							{/* <FormLabel id="demo-controlled-radio-buttons-group">Package Type:</FormLabel> */}
							<FormLabel id="packTypeLabel" error={formErrors["packType"]} sx={{ fontSize: 12 }}>Package Type*</FormLabel>
							<RadioGroup
								row
								size="small"
								aria-labelledby="demo-controlled-radio-buttons-group"
								name="controlled-radio-buttons-group"
								value={reqData?.packType || ''}
								onChange={(e) => handleFormChange(e, "packType")}
							>
								<FormControlLabel value="package" control={<Radio />} label={PACKAGE_TYPES["package"]} />
								<FormControlLabel value="hotels" control={<Radio />} label={PACKAGE_TYPES["hotels"]} />
								<FormControlLabel value="transport" control={<Radio />} label={PACKAGE_TYPES["transport"]} />
								{/* <FormControlLabel value="male" control={<Radio />} label="Only Transport" />
								<FormControlLabel value="male" control={<Radio />} label="Only Transport" /> */}
							</RadioGroup>
						</FormControl>
					</Grid>
					<Grid item xs={4}>
						<MainDestSelect handleDestSelect={handleDestSelect} destination={destination} />
						{/* <br /> */}
					</Grid>

					<Grid item xs={4}>
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

					{/* <Grid item xs={6} md={3} lg={3}>
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
					</Grid> */}

					<Grid item xs={4} md={4}>
						<InputLabel id="trackingId" error={formErrors["trackingId"]} sx={{ fontSize: 12 }}>Lead Pax Name*</InputLabel>
						<TextField
							error={formErrors["trackingId"]}
							sx={{ width: "100%" }}
							id="trackingId"
							value={reqData.trackingId || ''}
							variant="outlined"
							size="small"
							disabled={isUpdateflow}
							onChange={!isUpdateflow ? ((e) => handleFormChange(e, "trackingId")) : undefined}
						/>
					</Grid>

					{/* <Grid item xs={6} md={3} lg={3}>
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
					</Grid> */}

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
								value={reqData.startDate || null}
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

					{
						roomOcc.length > 0 && (<>
						<Grid item xs={12} sx={{ m: 1, ml: 2, mt: 2, pb: 2, border: `1px solid ${theme.palette.secondary.main}`, borderRadius: '5px', borderColor: 'secondary', width: 'inherit' }}>
							{
								roomOcc.map((r, rIndex) => {
									console.log("room render ", rIndex, r, (r.childAges || []).length);
									return (<Grid container spacing={2} 
										
									>
										<Grid item xs={12} md={12} lg={2} >
											<Box display={'flex'} justifyContent={'space-between'}>
												<Typography variant='caption'><b>Room {rIndex + 1}</b></Typography>
												<IconButton aria-label="delete" size="small" color="primary" onClick={() => handleRemoveRoom(rIndex)}>
													<DeleteIcon fontSize='small'/>
												</IconButton>
											</Box>
										</Grid>
										<Grid item xs={12} md={12} lg={10}>
											<Grid container spacing={1}>
												<Grid item xs={4} md={3} lg={3}>
													<InputLabel id="adultPax" error={formErrors["adultPax"]} sx={{ fontSize: 12 }}>Adult Pax*</InputLabel>
													<TextField
														error={formErrors["adultPax"]}
														sx={{ width: "100%" }}
														id="adultPax"
														variant="outlined"
														size="small"
														value={r.adultPax || ''}
														onChange={(e) => handleRoomOccChange(e, rIndex, "adultPax")}
														inputProps={{
															type: "number",
														}}
													/>
												</Grid>
												<Grid item xs={4} md={3} lg={3}>
													<InputLabel id="childPax" error={formErrors["childPax"]} sx={{ fontSize: 12 }}>Child Pax*</InputLabel>
													<TextField
														error={formErrors["childPax"]}
														sx={{ width: "100%" }}
														id="childPax"
														variant="outlined"
														size="small"
														value={r.childPax || ''}
														onChange={(e) => handleRoomOccChange(e, rIndex, "childPax")}
														inputProps={{
															type: "number",
														}}
													/>
												</Grid>
												
												{
													(r.childAges || []).map((c, cIndex) => {
														return (<Grid item xs={12} md={6} lg={6} >
																<Grid container spacing={1}>
																	<Grid item xs={6} md={4} lg={6}>
																		<InputLabel id="childPax" error={formErrors["childPax"]} sx={{ fontSize: 12 }}>{`Child ${cIndex + 1} Age*`}</InputLabel>
																		<TextField
																			error={formErrors["childPax"]}
																			sx={{ width: "100%" }}
																			id={`childPax-${rIndex}-${cIndex}-${Number(c.age)}`}
																			variant="outlined"
																			size="small"
																			onChange={(e) => handleChildAgeChange(e.target.value || '', rIndex, cIndex)}
																			inputProps={{
																				type: "number",
																			}}
																			value={c.age}
																			type="text"
																		/>
																	</Grid>
																	<Grid item xs={6} md={6} lg={6}>
																		{
																			Number(c.age) >= 3 && (<RadioGroup
																				aria-labelledby="demo-radio-buttons-group-label"
																				defaultValue="false"
																				name="radio-buttons-group"
																				onChange={(e) => handleChildAgeChange(c?.age, rIndex, cIndex, Boolean(e.target.value))}
																			>
																				<FormControlLabel value="false" control={<Radio size="small" defaultChecked />} label="Without Bed" />
																				<FormControlLabel value="true" control={<Radio size="small" />} label="With Bed" />
																			</RadioGroup>)
																		}
																	</Grid>
															</Grid>
														</Grid>)
													})
												}
											</Grid>
										</Grid>
										<Grid item xs={12} md={12} lg={11}>
											<hr />
										</Grid>
									</Grid>)
								})
							}
							<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', pt: '0px !important', m: 1, mb: 0 }}>
								<Button size="small" variant="outlined" onClick={addRoomOcc} sx={{ minWidth: "fit-content", my: 'auto' }}>Add Room +</Button>
							</Grid>
						</Grid>
						</>)
					}
					
					<Grid item xs={4} md={4}>
						<InputLabel id="trackingId" error={formErrors["noOfRooms"]} sx={{ fontSize: 12 }}>Pick Up Location*</InputLabel>
						<TextField
							error={formErrors["pickUp"]}
							sx={{ width: "100%" }}
							id="pickUp"
							value={reqData.pickUp || ''}
							variant="outlined"
							size="small"
							onChange={(e) => handleFormChange(e, "pickUp")}
						/>
					</Grid>
					<Grid item xs={4} md={4}>
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
					<Grid item xs={4} md={4}>
						<InputLabel id="noOfNights" error={formErrors["noOfNights"]} sx={{ fontSize: 12 }}>No of Cabs*</InputLabel>
						<TextField
							error={formErrors["noOfCabs"]}
							sx={{ width: "100%" }}
							id="noOfCabs"
							variant="outlined"
							size="small"
							value={reqData.noOfCabs || ''}
							onChange={(e) => handleFormChange(e, "noOfCabs")}
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
								Create Package &nbsp;
							</LoadingButton>
						)}
					</Grid>
				</Grid>
			</Box>
		</Box>
		
		{showSnackbar && (
			<SnackbarMsg
				open={showSnackbar.open}
				message={showSnackbar.message}
				anchorOrigin={showSnackbar.anchorOrigin}
				severity={showSnackbar.severity || "success"}
				onClose={() => setShowSnackbar({ open: false })}
			/>
		)}
	</>)
}

export default AppHome;