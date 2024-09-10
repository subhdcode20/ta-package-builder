import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const FooterSection = ({ packageData }) => {
    return (
        <>
            {packageData.map((data, index) => (

                <Box key={index} sx={{
                    backgroundColor: '#f7f7f7',
                    padding: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    {
                        (data.contactDetails.logo) ?
                            (<Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                                <img src="logo.png" alt="Company Logo" style={{ width: 100, height: 100 }} />
                            </Box>)
                            :
                            (<></>)
                    }

                    <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 5 }}>
                        Contact Us
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent:"space-between", width:"100%", fontSize:"30px"}}>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>
                         ✉️ {data.contactDetails.email}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>
                           📞 {data.contactDetails.phone}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>
                           🏢 {data.contactDetails.address}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </>
    );
};

export default FooterSection;