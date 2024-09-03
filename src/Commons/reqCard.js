import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Person4Icon from '@mui/icons-material/Person4';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import StarRateIcon from '@mui/icons-material/StarRate';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { format } from 'date-fns';

const ReqCardView = ({ reqData = {} }) => {
    let { destination, noOfNights, adultPax, childPax, startDate, starCategory } = reqData;

    return (
        <Paper sx={{display: "flex", justifyContent: "space-evenly", py: 1}}>
            <Typography variant="body1"><b>{destination}</b></Typography>&nbsp;
            <div style={{display: 'flex'}}>
                <NightsStayIcon />
                <Typography variant="body1" sx={{margin: "auto"}}>{noOfNights} N</Typography>
                &nbsp;
            </div>

            <div style={{display: 'flex'}}>
                <Person4Icon />
                <Typography variant="body1" sx={{margin: "auto"}}>{adultPax} A</Typography>
                &nbsp;
            </div>

            <div style={{display: 'flex'}}>
                <ChildFriendlyIcon />
                <Typography variant="body1" sx={{margin: "auto"}}>{childPax} C</Typography>
                &nbsp;
            </div>

            <div style={{display: 'flex'}}>
                <EventNoteIcon />
                <Typography variant="body1" sx={{margin: "auto"}}>{format(new Date(startDate), "dd-MMMM-yyyy")}</Typography>
                &nbsp;
            </div>

            <div style={{display: 'flex'}}>
                <StarRateIcon />
                <Typography variant="body1" sx={{margin: "auto"}}>{starCategory.value}</Typography>
                &nbsp;
            </div>
        </Paper>
    )
}

export default ReqCardView;