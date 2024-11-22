import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Person4Icon from '@mui/icons-material/Person4';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import StarRateIcon from '@mui/icons-material/StarRate';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Grid from "@mui/material/Grid";
import KingBedIcon from '@mui/icons-material/KingBed';
import { format } from 'date-fns';

const ReqCardView = ({ reqData = {} }) => {
    let { 
        destination, 
        noOfNights, 
        // adultPax, 
        // childPax, 
        roomOcc = [],
        startDate, 
        starCategory,
        trackingId 
    } = reqData;

    const { totalAdults = 0, totalChild = 0 } = roomOcc.reduce((acc, item) => {
        acc = {
            "totalAdults": acc.totalAdults += Number(item.adultPax),
            "totalChild": acc.totalChild += Number(item.adultPax)
        }
        return acc;
    }, {
        "totalAdults": 0,
        "totalChild": 0,        
    })

    console.log("pack req card render ", totalAdults, totalChild, reqData);
    return (<Paper sx={{ border: '1px solid', borderRadius: '5px', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ margin: 'auto', textAlign: 'center' }}>Request Details: <b>{trackingId}</b></Typography>
        <Grid container sx={{margin: 0, display: "flex", justifyContent: "space-evenly", p: 1, pt: 0}}>
            <Grid item xs={4} md={4} lg={2} display={'flex'} justifyContent={'flex-start'} sx={{ py: 1 }}>
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
            {/* <Grid item xs={4} md={2} lg={2} display={'flex'} justifyContent={'flex-start'} sx={{ py: 1 }}>
                <div style={{display: 'flex'}}>
                    <ChildFriendlyIcon />
                    <Typography variant="subtitle1"><b>{totalChild}</b> Child</Typography>
                    &nbsp;
                </div>
            </Grid> */}
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
            {/* <Grid item xs={4} md={2} lg={2} display={'flex'} justifyContent={'flex-start'} sx={{ py: 1 }}>
                <div style={{display: 'flex'}}>
                    <KingBedIcon />
                    <Typography variant="subtitle1"><b>{roomOcc.length}</b> Rooms</Typography>
                    &nbsp;
                </div>
            </Grid> */}
        </Grid>
    </Paper>)
}

export default ReqCardView;