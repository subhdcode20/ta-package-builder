import { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import useMediaQuery from "@mui/material/useMediaQuery";
import Accordion from '@mui/material/Accordion';
import Button from '@mui/material/Button';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useSelector, useDispatch } from 'react-redux';

import { setVoucherData, removeConfirmIds, updateConfirmIds, handleAddConfirmIds } from "../PackageBuilder/packBuilderSlice.js";

const ConfirmInputs = () => {
    // const [ confirmIds, setConfirmIds ] = useState({});
	const confirmIds = useSelector((state) => state.packBuilderData.voucherData);
	let { bookingConfirmId, hotelConfirmIds = [{text: ""}], transferConfirmIds = [{text: ""}], ssConfirmIds = [{text: ""}] } = confirmIds || {};
	const [ formErrors, setFormErrors ] = useState({});
	const dispatch = useDispatch();
	
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const handleFormChange = ({ field = null, val = null }) => {
		console.log("handleFormChange voucher ", field, val, confirmIds)
        if(!field) return;
        dispatch(setVoucherData({
			...confirmIds,
			[field]: val
		}))
    }

	console.log("confirm ids render ", confirmIds);
    return (<Accordion key={'confirmids'} sx={{ marginBottom: 2, border: '1px solid', borderRadius: '8px' }}>
		<AccordionSummary
		  expandIcon={<ExpandMoreIcon />}
		  aria-controls={`package-content-${'confirmids'}`}
		  id={`package-header-${'confirmids'}`}
		  sx={{ height: 6 }}
		>
		  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
			<Typography sx={{ fontWeight: 'bold', color: '#333' }}>
			  Voucher Confirmations
			</Typography>
			{/* <Button variant="contained" size="small" 
				onClick={() => {}} sx={{ ml: 'auto', mr: 2 }}
			>Save</Button> */}
			{/* <div>
			  <Button
				variant="contained"
				color="primary"
				href={`/voucher/${reqId}/${pkg?.packageId}` || ''}
				size="small"
				sx={{ marginLeft: 2 }}
			  >
				Create Voucher
			  </Button>
			  <Button
				variant="contained"
				color="primary"
				href={`/itinerary/${reqId}` || ''}
				size="small"
				sx={{ marginLeft: 2 }}
			  >
				View PDF
			  </Button>
			</div> */}
		  </Box>
		</AccordionSummary>
		<AccordionDetails sx={{ my: 0 }}>
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", my: 0 }}>
				<Box maxWidth={'lg'} sx={{ width: '100%', padding: isMobile ? 1 : 1, bgcolor: "transparent" }}>
					{/* <Box sx={{ "display": "flex", mb: 1 }}>
						<Typography variant="caption" sx={{ margin: 'auto' }}>
							<b>Enter Voucher Confirmation No/Ids:</b>
						</Typography>
					</Box> */}

					<Grid container spacing={2} sx={{ padding: isMobile ? 1 : 1 }}>
						<Grid item sx={{ pt: '0px !important' }} xs={4}>
							<InputLabel id="bookingConfirmId" error={formErrors["bookingConfirmId"]} sx={{ fontSize: 12 }}>Booking Confirmation*</InputLabel>
							<TextField
								error={formErrors["bookingConfirmId"]}
								sx={{ width: "100%" }}
								id="bookingConfirmId"
								variant="outlined"
								size="small"
								value={confirmIds?.bookingConfirmId || ''}
								onChange={(e) => handleFormChange({"field": "bookingConfirmId", "val": e.target.value})}
								inputProps={{
									type: "text",
								}}
							/>
						</Grid>
						<Grid item sx={{ pt: '0px !important' }} xs={4}>
							<InputLabel id="arrConfirmId" error={formErrors["arrConfirmId"]} sx={{ fontSize: 12 }}>Arrival Confirmation Id*</InputLabel>
							<TextField
								error={formErrors["arrConfirmId"]}
								sx={{ width: "100%" }}
								id="arrConfirmId"
								variant="outlined"
								size="small"
								value={confirmIds.arrConfirmId || ''}
								onChange={(e) => handleFormChange({"field": "arrConfirmId", "val": e.target.value})}
								inputProps={{
									type: "text",
								}}
							/>
						</Grid>
						<Grid item sx={{ pt: '0px !important' }} xs={4}>
							<InputLabel id="depConfirmId" error={formErrors["depConfirmId"]} sx={{ fontSize: 12 }}>Departure Confirmation Id*</InputLabel>
							<TextField
								error={formErrors["depConfirmId"]}
								sx={{ width: "100%" }}
								id="depConfirmId"
								variant="outlined"
								size="small"
								value={confirmIds.depConfirmId || ''}
								onChange={(e) => handleFormChange({"field": "depConfirmId", "val": e.target.value})}
								inputProps={{
									type: "text",
								}}
							/>
						</Grid>

						{
							hotelConfirmIds && hotelConfirmIds.length > 0 && (<Grid item xs={12} md={6} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
								{
									hotelConfirmIds && (<Box sx={{ border: `1px solid`, borderColor: 'primary', borderRadius: 1, p: 1, mb: 1 }}>
										<InputLabel id={'iti-desc'} sx={{ fontSize: 12 }}>Hotel Confirmations:</InputLabel>
										{
											hotelConfirmIds.map((itiText, itiTextIndex) => {
												return (<Box sx={{ display: 'flex', p: 1, position: 'relative' }}>
													{/* <Box
														component="span"
														sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
													>•</Box>  */}
													<IconButton aria-label="delete" size="small" color="primary" 
														onClick={() => dispatch(removeConfirmIds({policyType: "hotelConfirmIds", deleteIndex: itiTextIndex}))}
													>
														<DeleteIcon fontSize='small'/>
													</IconButton>
													&nbsp;
													<TextField
														sx={{ width: "100%" }}
														id=""
														value={itiText?.text || ''}
														variant="standard"
														multiline
														size="small"
														onChange={(e) => dispatch(updateConfirmIds({policyType: "hotelConfirmIds", val: e.target.value, textIndex: itiTextIndex}))}
													/>
													{/* {bull} <small>{parse(itiText)}</small> */}
												</Box>)
											})
										}
										<Box sx={{ display: 'flex', px: 1, position: 'relative' }}>
											<IconButton aria-label="delete" size="small" color="primary" 
												onClick={() => dispatch(handleAddConfirmIds({policyType: "hotelConfirmIds"}))}
											>
												<AddCircleOutlineIcon fontSize='small'/>
											</IconButton>
										</Box>
									</Box>)
								}
							</Grid>)
						}

						{
							transferConfirmIds && transferConfirmIds.length > 0 && (<Grid item xs={12} md={6} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
								{
									transferConfirmIds && (<Box sx={{ border: `1px solid`, borderColor: 'primary', borderRadius: 1, p: 1, mb: 1 }}>
										<InputLabel id={'iti-desc'} sx={{ fontSize: 12 }}>Transfers Confirmations:</InputLabel>
										{
											transferConfirmIds.map((itiText, itiTextIndex) => {
												return (<Box sx={{ display: 'flex', p: 1, position: 'relative' }}>
													{/* <Box
														component="span"
														sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
													>•</Box>  */}
													<IconButton aria-label="delete" size="small" color="primary" 
														onClick={() => dispatch(removeConfirmIds({policyType: "transferConfirmIds", deleteIndex: itiTextIndex}))}
													>
														<DeleteIcon fontSize='small'/>
													</IconButton>
													&nbsp;
													<TextField
														sx={{ width: "100%" }}
														id=""
														value={itiText?.text || ''}
														variant="standard"
														multiline
														size="small"
														onChange={(e) => dispatch(updateConfirmIds({policyType: "transferConfirmIds", val: e.target.value, textIndex: itiTextIndex}))}
													/>
													{/* {bull} <small>{parse(itiText)}</small> */}
												</Box>)
											})
										}
										<Box sx={{ display: 'flex', px: 1, position: 'relative' }}>
											<IconButton aria-label="delete" size="small" color="primary" 
												onClick={() => dispatch(handleAddConfirmIds({policyType: "transferConfirmIds"}))}
											>
												<AddCircleOutlineIcon fontSize='small'/>
											</IconButton>
										</Box>
									</Box>)
								}
							</Grid>)
						}

						{
							ssConfirmIds && ssConfirmIds.length > 0 && (<Grid item xs={12} md={6} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
								{
									ssConfirmIds && (<Box sx={{ border: `1px solid`, borderColor: 'primary', borderRadius: 1, p: 1, mb: 1 }}>
										<InputLabel id={'iti-desc'} sx={{ fontSize: 12 }}>Transfers Confirmations:</InputLabel>
										{
											ssConfirmIds.map((itiText, itiTextIndex) => {
												return (<Box sx={{ display: 'flex', p: 1, position: 'relative' }}>
													{/* <Box
														component="span"
														sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
													>•</Box>  */}
													<IconButton aria-label="delete" size="small" color="primary" 
														onClick={() => dispatch(removeConfirmIds({policyType: "ssConfirmIds", deleteIndex: itiTextIndex}))}
													>
														<DeleteIcon fontSize='small'/>
													</IconButton>
													&nbsp;
													<TextField
														sx={{ width: "100%" }}
														id=""
														value={itiText?.text || ''}
														variant="standard"
														multiline
														size="small"
														onChange={(e) => dispatch(updateConfirmIds({policyType: "ssConfirmIds", val: e.target.value, textIndex: itiTextIndex}))}
													/>
													{/* {bull} <small>{parse(itiText)}</small> */}
												</Box>)
											})
										}
										<Box sx={{ display: 'flex', px: 1, position: 'relative' }}>
											<IconButton aria-label="delete" size="small" color="primary" 
												onClick={() => dispatch(handleAddConfirmIds({policyType: "ssConfirmIds"}))}
											>
												<AddCircleOutlineIcon fontSize='small'/>
											</IconButton>
										</Box>
									</Box>)
								}
							</Grid>)
						}


						{/* <Grid item sx={{ pt: '0px !important' }} xs={3}>
							<InputLabel id="hotelConfirmId" error={formErrors["hotelConfirmId"]} sx={{ fontSize: 12 }}>Hotel Confirmation Id*</InputLabel>
							<TextField
								error={formErrors["hotelConfirmId"]}
								sx={{ width: "100%" }}
								id="hotelConfirmId"
								variant="outlined"
								size="small"
								value={confirmIds?.hotelConfirmId || ''}
								onChange={(e) => handleFormChange({"field": "hotelConfirmId", "val": e.target.value})}
								inputProps={{
									type: "text",
								}}
							/>
						</Grid>
						<Grid item sx={{ pt: '0px !important', mb: 1 }} xs={3}>
							<InputLabel id="transfersConfirmId" error={formErrors["transfersConfirmId"]} sx={{ fontSize: 12 }}>Transfer Confirmation</InputLabel>
							<TextField
								error={formErrors["transfersConfirmId"]}
								sx={{ width: "100%" }}
								id="transfersConfirmId"
								variant="outlined"
								size="small"
								value={confirmIds?.transfersConfirmId || ''}
								onChange={(e) => handleFormChange({"field": "transfersConfirmId", "val": e.target.value})}
								inputProps={{
									type: "text",
								}}
							/>
						</Grid>
						<Grid item sx={{ pt: '0px !important', mb: 1 }} xs={3}>
							<InputLabel id="arrConfirmId" error={formErrors["arrConfirmId"]} sx={{ fontSize: 12 }}>Arrival Confirmation</InputLabel>
							<TextField
								error={formErrors["arrConfirmId"]}
								sx={{ width: "100%" }}
								id="arrConfirmId"
								variant="outlined"
								size="small"
								value={confirmIds?.arrConfirmId || ''}
								onChange={(e) => handleFormChange({"field": "arrConfirmId", "val": e.target.value})}
								inputProps={{
									type: "text",
								}}
							/>
						</Grid>
						<Grid item sx={{ pt: '0px !important', mb: 1 }} xs={3}>
							<InputLabel id="depConfirmId" error={formErrors["depConfirmId"]} sx={{ fontSize: 12 }}>Departure Confirmation</InputLabel>
							<TextField
								error={formErrors["depConfirmId"]}
								sx={{ width: "100%" }}
								id="depConfirmId"
								variant="outlined"
								size="small"
								value={confirmIds?.depConfirmId || ''}
								onChange={(e) => handleFormChange({"field": "depConfirmId", "val": e.target.value})}
								inputProps={{
									type: "text",
								}}
							/>
						</Grid>
						<Grid item sx={{ pt: '0px !important', mb: 1 }} xs={6}>
							<InputLabel id="ssConfirmId" error={formErrors["ssConfirmId"]} sx={{ fontSize: 12 }}>Sightseeing Confirmations</InputLabel>
							<TextField
								error={formErrors["ssConfirmId"]}
								sx={{ width: "100%" }}
								id="ssConfirmId"
								variant="outlined"
								multiline
								minRows={2}
								size="small"
								value={confirmIds.ssConfirmId || ''}
								onChange={(e) => handleFormChange({"field": "ssConfirmId", "val": e.target.value})}
								inputProps={{
									type: "text",
								}}
							/>
						</Grid> */}
					</Grid>
				</Box>
			</Box>
		
		
		</AccordionDetails>
	</Accordion>)
}

export default ConfirmInputs;