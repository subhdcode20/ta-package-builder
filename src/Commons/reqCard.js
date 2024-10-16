import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Person4Icon from '@mui/icons-material/Person4';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import StarRateIcon from '@mui/icons-material/StarRate';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Grid from "@mui/material/Grid";
import { format } from 'date-fns';

const ReqCardView = ({ reqData = {} }) => {
    let { destination, noOfNights, adultPax, childPax, startDate, starCategory } = reqData;

    return (<Paper sx={{ border: '1px solid', borderRadius: '5px', mb: 1 }}>
        <Typography variant="body1" sx={{ margin: 'auto', textAlign: 'center' }}><b>Request Details:</b></Typography>
        <Grid container sx={{margin: 0, display: "flex", justifyContent: "space-evenly", p: 1, pt: 0}}>
            <Grid item xs={4} md={4} lg={2} display={'flex'} justifyContent={'flex-start'} sx={{ py: 1 }}>
                <Typography variant="body1"><b>{destination}</b></Typography>&nbsp;
            </Grid>
            <Grid item xs={4} md={2} lg={2} display={'flex'}  justifyContent={'center'} sx={{ py: 1 }}>
                <div style={{display: 'flex', minWidth: 'fit-content'}}>
                    <NightsStayIcon />
                    <Typography variant="body1">{noOfNights} N</Typography>
                    &nbsp;
                </div>
            </Grid>
            <Grid item xs={4} md={2} lg={2} display={'flex'} justifyContent={'flex-end'} sx={{ py: 1 }}>
                <div style={{display: 'flex'}}>
                    <Person4Icon />
                    <Typography variant="body1">{adultPax} A</Typography>
                    &nbsp;
                </div>
            </Grid>
            <Grid item xs={4} md={2} lg={2} display={'flex'} justifyContent={'flex-start'} sx={{ py: 1 }}>
                <div style={{display: 'flex'}}>
                    <ChildFriendlyIcon />
                    <Typography variant="body1">{childPax} C</Typography>
                    &nbsp;
                </div>
            </Grid>
            <Grid item xs={4} md={2} lg={2} display={'flex'} justifyContent={'center'} sx={{ py: 1 }}>
                <div style={{display: 'flex'}}>
                    <EventNoteIcon />
                    <Typography variant="body1" sx={{minWidth: 'fit-content'}}>{format(new Date(startDate), "dd-MMM-yyyy")}</Typography>
                    &nbsp;
                </div>
            </Grid>
            <Grid item xs={4} md={2} lg={2} display={'flex'} justifyContent={'flex-end'} sx={{ py: 1 }}>
                <div style={{display: 'flex'}}>
                    <StarRateIcon />
                    <Typography variant="body1">{starCategory.value}</Typography>
                    &nbsp;
                </div>
            </Grid>
        </Grid>
    </Paper>)
}

export default ReqCardView;