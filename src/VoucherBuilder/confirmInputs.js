import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import useMediaQuery from "@mui/material/useMediaQuery";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Button } from "@mui/material";


const ConfirmInputs = () => {
    const [ confirmIds, setConfirmIds ] = useState({});
	const [ formErrors, setFormErrors ] = useState({});
	
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const handleFormChange = ({ field = null, val = null }) => {
        if(!field) return;
        setConfirmIds(prev => {
            return {
                ...prev,
                [field]: val
            }
        })
    }

    return (<Accordion key={'confirmids'} sx={{ marginBottom: 2 }}>
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
		<AccordionDetails>
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", my: 2 }}>
				<Box maxWidth={'lg'} sx={{ width: '100%', border: "2px solid #ccc", borderRadius: 4, padding: isMobile ? 1 : 2, bgcolor: "transparent" }}>
					<Box sx={{ "display": "flex", mb: 1 }}>
						<Typography variant="caption" sx={{ margin: 'auto' }}>
							<b>Enter Voucher Confirmation No/Ids:</b>
							{/* <b>{(isUpdateflow) ? `Update Your Request` : `Create New Request`}</b> */}
						</Typography>
					</Box>

					<Grid container spacing={2} sx={{ padding: isMobile ? 1 : 1 }}>
						<Grid item xs={3}>
							<InputLabel id="hotelConfirmId" error={formErrors["hotelConfirmId"]} sx={{ fontSize: 12 }}>Hotel Confirmation Id*</InputLabel>
							<TextField
								error={formErrors["hotelConfirmId"]}
								sx={{ width: "100%" }}
								id="hotelConfirmId"
								variant="outlined"
								size="small"
								value={confirmIds.hotelConfirmId || ''}
								onChange={(e) => handleFormChange({"field": "hotelConfirmId", "val": e.target.value})}
								inputProps={{
									type: "text",
								}}
							/>
						</Grid>
						<Grid item xs={3}>
							<InputLabel id="transfersConfirmId" error={formErrors["transfersConfirmId"]} sx={{ fontSize: 12 }}>Hotel Confirmation Id*</InputLabel>
							<TextField
								error={formErrors["transfersConfirmId"]}
								sx={{ width: "100%" }}
								id="transfersConfirmId"
								variant="outlined"
								size="small"
								value={confirmIds.transfersConfirmId || ''}
								onChange={(e) => handleFormChange({"field": "transfersConfirmId", "val": e.target.value})}
								inputProps={{
									type: "text",
								}}
							/>
						</Grid>
						<Grid item xs={3}>
							<InputLabel id="flightsConfirmId" error={formErrors["flightsConfirmId"]} sx={{ fontSize: 12 }}>Hotel Confirmation Id*</InputLabel>
							<TextField
								error={formErrors["flightsConfirmId"]}
								sx={{ width: "100%" }}
								id="flightsConfirmId"
								variant="outlined"
								size="small"
								value={confirmIds.flightsConfirmId || ''}
								onChange={(e) => handleFormChange({"field": "flightsConfirmId", "val": e.target.value})}
								inputProps={{
									type: "text",
								}}
							/>
						</Grid>
						<Grid item xs={3} sx={{ display: 'flex' }}>
							<Button variant="contained" size="small" 
								onClick={() => {}} sx={{ margin: 'auto' }}
							>Save</Button>
						</Grid>
						
						
					</Grid>
				</Box>
			</Box>
		
		
		</AccordionDetails>
	</Accordion>)
}

export default ConfirmInputs;