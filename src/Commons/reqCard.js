import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Person4Icon from '@mui/icons-material/Person4';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import StarRateIcon from '@mui/icons-material/StarRate';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import KingBedIcon from '@mui/icons-material/KingBed';
import TextField from '@mui/material/TextField';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';

import { setArrFlightsData } from '../PackageBuilder/packBuilderSlice.js';
import { PACKAGE_TYPES } from '../Constants.js';

const ReqCardView = ({ reqData = {} }) => {
    let { 
        destination, 
        noOfNights, 
        // adultPax, 
        // childPax, 
        roomOcc = [],
        startDate, 
        starCategory,
        trackingId = '',
        pickUp = '',
        packType = ''
    } = reqData;
    const itiFlightsData = useSelector((state) => state.packBuilderData.itiFlightsData) || null;

    let dispatch = useDispatch();

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

    console.log("pack req card render ", totalAdults, totalChild, reqData);
    return (<Paper sx={{ border: '1px solid', borderRadius: '5px', mb: 1 }}>
        <Typography variant="caption" sx={{ margin: 'auto', textAlign: 'center', display: 'inherit', mt: 1 }}>
            <b>{packType ? `${PACKAGE_TYPES[packType] || ''} ` : ''}</b>Request Details For <b>{trackingId}</b>
        </Typography>
        <Box display='flex' flexWrap='wrap'>
            <Box sx={{display: 'flex', minWidth: 'fit-content', m: 1}}><Typography variant="caption"><b>{destination}</b></Typography>&nbsp;</Box>
            <Box sx={{display: 'flex', minWidth: 'fit-content', m: 1}}>
                <NightsStayIcon fontSize='small' />
                <Typography variant="caption"><b>{noOfNights}</b> Nights</Typography>
                &nbsp;
            </Box>
            <Box sx={{display: 'flex', minWidth: 'fit-content', m: 1}}>
                <EventNoteIcon fontSize='small' />
                <Typography variant="caption" sx={{minWidth: 'fit-content'}}><b>{format(new Date(startDate), "dd-MMM-yyyy")}</b></Typography>
                &nbsp;
            </Box>
            <Box sx={{display: 'flex', minWidth: 'fit-content', m: 1}}>
                <Person4Icon fontSize='small' />
                <Typography variant="caption"><b>{totalAdults}</b> Adults</Typography>
                &nbsp;
            </Box>
            <Box sx={{display: 'flex', minWidth: 'fit-content', m: 1}}>
                <ChildFriendlyIcon fontSize='small' />
                <Typography variant="caption"><b>{totalChild}</b> Child</Typography>
                &nbsp;
            </Box>
            <Box sx={{display: 'flex', minWidth: 'fit-content', m: 1}}>
                <StarRateIcon fontSize='small' />
                <Typography variant="caption"><b>{starCategory.value}</b> Hotel</Typography>
                &nbsp;
            </Box>
            <Box sx={{display: 'flex', minWidth: 'fit-content', m: 1}}>
                <KingBedIcon fontSize='small' />
                <Typography variant="caption"><b>{roomOcc.length}</b> Rooms</Typography>
                &nbsp;
            </Box>
            <Box sx={{display: 'flex', minWidth: 'fit-content', m: 1}}>
                {/* <KingBedIcon /> */}
                <Typography variant="caption">Pick Up From: <b>{pickUp}</b></Typography>
                &nbsp;
            </Box>
            <Box sx={{display: 'flex', minWidth: 'fit-content', m: 1}}>
                {/* <KingBedIcon /> */}
                <Typography variant="caption">Arrival Flights:</Typography>
                &nbsp;
                <TextField
                    sx={{ width: "100%" }}
                    id="flihtsArr"
                    value={itiFlightsData?.arr || ''}
                    variant="standard"
                    placeholder='6E-804 at 09:00 AM'
                    size="small"
                    onChange={(e) => dispatch(setArrFlightsData({"flightType": "arr", "flightText": e.target.value}))}
                />
            </Box>
            <Box sx={{display: 'flex', minWidth: 'fit-content', m: 1}}>
                {/* <KingBedIcon /> */}
                <Typography variant="caption">Departure Flights:</Typography>
                &nbsp;
                <TextField
                    sx={{ width: "100%" }}
                    id="flihtsArrdep"
                    value={itiFlightsData?.dep || ''}
                    variant="standard"
                    placeholder='6E-804 at 09:00 AM'
                    size="small"
                    onChange={(e) => dispatch(setArrFlightsData({"flightType": "dep", "flightText": e.target.value}))}
                />
            </Box>
        </Box>
        
        {/* <Grid container sx={{margin: 0, display: "flex", justifyContent: "space-evenly", p: 1, pt: 0}}>
            <Grid item xs={4} md={4} lg={4} display={'flex'} justifyContent={'flex-start'} sx={{ py: 1 }}>
                <Typography variant="caption"><b>{destination}</b></Typography>&nbsp;
            </Grid>
            <Grid item xs={4} md={2} lg={2} display={'flex'}  justifyContent={'center'} sx={{ py: 1 }}>
                <div style={{display: 'flex', minWidth: 'fit-content'}}>
                    <NightsStayIcon fontSize='small' />
                    <Typography variant="caption"><b>{noOfNights}</b> Nights</Typography>
                    &nbsp;
                </div>
            </Grid>
            <Grid item xs={4} md={2} lg={2} display={'flex'} justifyContent={'center'} sx={{ py: 1 }}>
                <div style={{display: 'flex'}}>
                    <EventNoteIcon fontSize='small' />
                    <Typography variant="caption" sx={{minWidth: 'fit-content'}}><b>{format(new Date(startDate), "dd-MMM-yyyy")}</b></Typography>
                    &nbsp;
                </div>
            </Grid>
            <Grid item xs={6} md={4} lg={4} display={'flex'} justifyContent={'center'} sx={{ py: 1 }}>
                <div style={{display: 'flex'}}>
                    <Person4Icon fontSize='small' />
                    <Typography variant="caption"><b>{totalAdults}</b> Adults</Typography>
                    &nbsp;
                </div>
                <div style={{display: 'flex'}}>
                    <ChildFriendlyIcon fontSize='small' />
                    <Typography variant="caption"><b>{totalChild}</b> Child</Typography>
                    &nbsp;
                </div>
            </Grid>
            <Grid item xs={6} md={4} lg={4} display={'flex'} justifyContent={'flex-end'} sx={{ py: 1 }}>
                <div style={{display: 'flex'}}>
                    <StarRateIcon fontSize='small' />
                    <Typography variant="caption"><b>{starCategory.value}</b> Hotel</Typography>
                    &nbsp;
                </div>
                <div style={{display: 'flex'}}>
                    <KingBedIcon fontSize='small' />
                    <Typography variant="caption"><b>{roomOcc.length}</b> Rooms</Typography>
                    &nbsp;
                </div>
            </Grid>
            <Grid item xs={6} md={4} lg={4} display={'flex'} justifyContent={'flex-start'} sx={{ py: 1 }}>
                <div style={{display: 'flex'}}>
                    <Typography variant="caption">Pick Up From: <b>{pickUp}</b></Typography>
                    &nbsp;
                </div>
            </Grid>
        </Grid> */}
    </Paper>)
}

export default ReqCardView;