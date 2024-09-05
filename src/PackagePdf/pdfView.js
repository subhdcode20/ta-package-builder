import React from 'react';
import { Box, Container, Grid, Typography, Chip } from '@mui/material';
import { InfoRounded, PersonRounded, LocationOn, Phone } from '@mui/icons-material';
import PriceBreakdown from './priceBreakdown';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import Brightness2 from '@mui/icons-material/Brightness2';
import ContactSection from './contactSection';

const PdfView = ({ packageData }) => {
    console.log("PDF VIEWW : ", packageData);
    return (
        <>
            <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                <Typography variant="h4" sx={{ marginY: "10px", fontWeight: 700 }}>Package Details</Typography>
            </Box>
            <hr />
            <Container maxWidth="md" sx={{ height: '100vh', overflowY: 'auto', padding: 2, backgroundColor: 'black' }}>
                <Grid container spacing={2}>
                    {packageData.map((data, index) => (
                        <Grid item xs={12} key={index}>
                            <Box sx={{ padding: 2, border: '1px solid #ddd', backgroundColor: 'white', mb: 4 }}>

                                <Box sx={{ height: "100vh" }}>
                                    <Box sx={{
                                        marginTop:30,
                                        padding: 4,
                                        border: '1px solid #ddd',
                                        backgroundColor: 'white',
                                        mb: 4,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        borderRadius: '10px',
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <Typography variant='h3' sx={{ fontWeight: 600, marginBottom: "20px" }}>
                                            {/* <LocationOnIcon fontSize='large' sx={{ marginRight: "10px" }} /> */}
                                            {data.hotels[0].destination} Trip
                                        </Typography>
                                        
                                        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px",  }}>
                                            <PeopleIcon sx={{ marginRight: "10px" }} />
                                            <Typography variant="body1" sx={{fontSize:"20px"}}>
                                                {data.hotels[0].occupancy.adults} adults, {data.hotels[0].occupancy.childs} childs
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" , }}>
                                            <Typography variant="body1" sx={{fontSize:"20px"}}>
                                                <b>No. of Nights </b>: {data.noOfNights}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" , }}>
                                            <Typography variant="body1" sx={{fontSize:"20px"}}>
                                                <b>Tracking ID </b>: {data.trackingId}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" , }}>
                                            <Typography variant="body1" sx={{fontSize:"20px"}}>
                                                <b>Category </b>: {data.category}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <hr style={{ marginBottom: "20px" }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginY:4 }}>
                                    <Typography variant="h4" sx={{fontWeight:600}}>Itinerary</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: "20px", fontSize:"20px" }}>
                                        <Phone sx={{ mr: 1 }} />
                                        <Typography>{data.userId}</Typography>
                                    </Box>
                                </Box>
                                {data.hotels.map((hotel, hotelIndex) => (
                                    <>

                                        <Box key={hotelIndex} sx={{ marginBottom: 5 }}>
                                            <Chip
                                                // icon={<InfoRounded sx={{ color: '#b352d1' }} />}
                                                label={`Day: ${hotelIndex + 1}`}
                                                sx={{ backgroundColor: 'transparent', borderRadius: 1, boxShadow: 1, marginBottom: "5px", fontWeight: 600, fontSize:"20px" }}
                                            />
                                            <Box sx={{ padding: 2, border: '1px solid lightgrey', backgroundColor: '#fff' }}>
                                                <Grid container spacing={2}>
                                                {
                                                    (hotel.image) ? 
                                                    (<Grid item xs={12} sm={4}>
                                                        <img
                                                            src={hotel.image}
                                                            alt="Hotel"
                                                            style={{ width: '250px', height: '200px', objectFit: 'cover' }}
                                                        />
                                                    </Grid>)
                                                    :
                                                    (<></>)
                                                }
                                                    
                                                    <Grid item xs={12} sm={8} sx={{ marginBottom: "10px" }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "25px" }}>{hotel.hotelName}</Typography>
                                                        <Typography variant="subtitle2" sx={{ fontSize: "22px" }}>{hotel.roomName}</Typography>
                                                        <Chip
                                                            icon={<PersonRounded />}
                                                            label={`${hotel.occupancy.adults} adults, ${hotel.occupancy.child} child`}
                                                            sx={{ backgroundColor: 'transparent', borderRadius: 1, boxShadow: 1, marginBottom: "5px", fontSize:"20px" }}
                                                        />
                                                        <br />
                                                        <Chip
                                                            icon={<LocationOn />}
                                                            label={hotel.destination}
                                                            sx={{ backgroundColor: 'transparent', borderRadius: 1, boxShadow: 1, fontSize:"20px"}}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                </Box>
                                            </Box>
                                        <hr />
                                        </Box>
                                    </>
                                ))}
                                <Box sx={{ padding: 2, border: '1px solid #ddd', backgroundColor: 'white', mb: 4 }}>
                                    <PriceBreakdown packageData={packageData} />
                                </Box>
                                <Box sx={{ padding: 2, mb: 4 }}>
                                    <ContactSection packageData={packageData} />
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
                

            </Container>
        </>
    );
}

export default PdfView;
