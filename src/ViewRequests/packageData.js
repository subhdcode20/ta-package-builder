// packageData.js
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const PackageData = ({ packageDetails }) => {
  const rowTitles = ['Hotel Name', 'Location', 'Room Name', 'Adults', 'Child', 'Room Price'];

  return (
    <Box sx={{ padding: 2, border: '1px solid #ddd', marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        Package Details
      </Typography>

      {packageDetails?.length > 0 ? (
        packageDetails.map((pkg, pkgIndex) => (
          <Box key={pkgIndex} sx={{ marginBottom: 4 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Package {pkgIndex + 1}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ minWidth: 150, fontWeight: 'bold' }}></Box>
                {pkg?.hotels?.map((hotel, dayIndex) => (
                  <Box key={dayIndex} sx={{ minWidth: 200, fontWeight: 'bold', textAlign: 'center' }}>
                    Day {dayIndex + 1}
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ minWidth: 150, fontWeight: 'bold' }}>Hotel Name</Box>
                {pkg?.hotels?.map((hotel, index) => (
                  <Box key={index} sx={{ minWidth: 200 }}>{hotel.hotelName}</Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ minWidth: 150, fontWeight: 'bold' }}>Location</Box>
                {pkg?.hotels?.map((hotel, index) => (
                  <Box key={index} sx={{ minWidth: 200 }}>{hotel.location}</Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ minWidth: 150, fontWeight: 'bold' }}>Room Name</Box>
                {pkg?.hotels?.map((hotel, index) => (
                  <Box key={index} sx={{ minWidth: 200 }}>
                    {hotel.selectedRooms?.[0]?.roomName || 'N/A'}
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ minWidth: 150, fontWeight: 'bold' }}>Adults</Box>
                {pkg?.hotels?.map((hotel, index) => (
                  <Box key={index} sx={{ minWidth: 200 }}>
                    {hotel.selectedRooms?.[0]?.selectedOccupancy?.adults || 'N/A'}
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ minWidth: 150, fontWeight: 'bold' }}>Child</Box>
                {pkg?.hotels?.map((hotel, index) => (
                  <Box key={index} sx={{ minWidth: 200 }}>
                    {hotel.selectedRooms?.[0]?.selectedOccupancy?.child || 'N/A'}
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ minWidth: 150, fontWeight: 'bold' }}>Room Price</Box>
                {pkg?.hotels?.map((hotel, index) => (
                  <Box key={index} sx={{ minWidth: 200 }}>
                    {hotel.selectedRooms?.[0]?.roomPrice || 'N/A'}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ))
      ) : (
        <Typography>No Packages</Typography>
      )}
    </Box>
  );
};

export default PackageData;
