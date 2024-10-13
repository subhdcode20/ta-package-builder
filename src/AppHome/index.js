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

import MainDestSelect from "./mainDestSearch.js";
import { MAX_CHILD_AGE, HOTEL_STAR_CAT_OPTS } from '../Constants.js'
import { db, auth } from "../firebaseConfig";
import { submitReqData } from "../PackageBuilder/packBuilderSlice.js";
import LoadingButton from '../Commons/LoadingButton.jsx';
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
	cabType: "",
	totalRooms:"",
};

const requiredFields = [
	"destination",
	"adultPax",
	"noOfNights",
	"startDate",
	"trackingId",
	"starCategory",
	"cabType",
	"totalRooms"
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
		if (!reqData.childPax || reqData.childPax <= 0) return;
		let newChildAges = [];
		let len = childAges.length;
		for (let ii = 0; ii < reqData.childPax; ii++) {
			if (ii < len) {
				newChildAges.push(childAges[ii]);
			} else {
				newChildAges.push(null);
			}
		}
		console.log("child age effect ", reqData.childPax, newChildAges)
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
		let userPackRef = await setDoc(doc(db, "userPackages", userData?.phone), {
			packagesList: arrayUnion(newReqId),
			updatedAt: Date.now()
		}, { merge: true });
		console.log("new Req post 2: ", reqData, newReqId, reqRef, userPackRef);
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
		if (reqData.totalRooms !== requestData.totalRooms) updatedFields.totalRooms = reqData.totalRooms;
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
	const handleChildAgeChange = (age, childIndex) => {
		console.log("child age change", age, childIndex, !isNaN(age), age > MAX_CHILD_AGE);
		console.log("MAXAGE: ", MAX_CHILD_AGE, childIndex, age);
		if (isNaN(age)) return;
		if (age > MAX_CHILD_AGE) {
			// TODO: show error
			return;
		}
		console.log("PREVIOUSAGE", childAges);
		let newChildAges = childAges;
		if (newChildAges.length < childIndex) {
			for (let i = newChildAges.length; i <= childIndex; i++) {
				newChildAges[i] = null;
			}
		}
		newChildAges[childIndex] = Number(age);
		console.log("NEWCHILDRENAGES", newChildAges);
		setChildAges(newChildAges);
	}

	console.log("child home render ", childAges, storeReqData)
	console.log("DESTINATION", destination)
	return (
		<Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
			<Box maxWidth={'md'} sx={{ border: "2px solid #ccc", borderRadius: 4, padding: 3, bgcolor: "transparent" }}>
				<Box sx={{ "display": "flex", mb: 2 }}>
					<Typography variant="h6" sx={{ margin: 'auto' }}>
						<b>{(isUpdateflow) ? `Update Request` : `Create New Request`}</b>
					</Typography>
				</Box>

				<MainDestSelect handleDestSelect={handleDestSelect} destination={destination} />
				<br />
				<Grid container spacing={2}>
					
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
					<Grid item xs={6}>
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
					<Grid item xs={6}>
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
					<Grid item xs={4}>
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

					<Grid item xs={4} display="flex">
						{childAges.map((c, cIndex) => {
							return (
								<Grid item xs={12} md={4} lg={4} sx={{ mr: 1 }}>
									<InputLabel id="childPax" error={formErrors["childPax"]} sx={{ fontSize: 12 }}>{`Child ${cIndex + 1} Age*`}</InputLabel>
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
								</Grid>
							);
						})}
					</Grid>
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
					<Grid item xs={6}>
						<InputLabel id="totalRooms" error={formErrors["totalRooms"]} sx={{ fontSize: 12 }}>Total No. of Rooms*</InputLabel>
						<TextField
							error={formErrors["totalRooms"]}
							sx={{ width: "100%" }}
							id="totalRooms"
							variant="outlined"
							size="small"
							value={reqData.totalRooms || ''}
							onChange={(e) => handleFormChange(e, "totalRooms")}
							inputProps={{
								type: "number",
							}}
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