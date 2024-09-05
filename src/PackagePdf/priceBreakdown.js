import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const PriceBreakdown = ({ packageData }) => {
    return (
        <>
            {packageData.map((data, index) => (
                <Box sx={{
                    padding: 4,
                    border: '1px solid #ddd',
                    backgroundColor: 'white',
                    mb: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    borderRadius: '10px', 
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' 
                }} key={index}>
                    <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', marginX:"20px"  }}>
                        Price Breakdown
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, marginX:"20px" }}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Total Price
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {data.hotels[0].selectedRooms.roomPrice}
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'gray', marginX:"20px"  }}>
                        (INCLUDING ALL TAXES)
                    </Typography>
                </Box>
            ))}
        </>
    );
}

export default PriceBreakdown;