import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const PackageData = ({ packageDetails }) => {
  console.log("DATAPACKAGEIN:", JSON.stringify(packageDetails));

  return (
    <Box sx={{ padding: 3, borderRadius: 2, backgroundColor: '#f5f5f5', marginTop: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Package Details
      </Typography>

      {packageDetails?.length > 0 ? (
        packageDetails.map((pkg, pkgIndex) => (
          <Box
            key={pkgIndex}
            sx={{
              marginBottom: 4,
              padding: 3,
              backgroundColor: '#fff',
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Slightly larger shadow for elegance
              transition: 'box-shadow 0.3s ease',
              '&:hover': { boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)' }, // Hover effect for interactivity
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 3, fontWeight: 'bold', color: '#444' }}>
              Package {pkgIndex + 1}
            </Typography>

            {/* Display Star Category */}
            <Box sx={{ display: 'flex', gap: 4, marginBottom: 3 }}>
              <Typography sx={{ fontWeight: 'bold', color: '#555' }}>Star Category:</Typography>
              <Typography>{pkg?.req?.starCategory?.label || 'N/A'}</Typography>
            </Box>

            <Divider sx={{ marginBottom: 3 }} />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                overflowX: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              {/* Header Row with Days as Columns */}
              <Box sx={{ display: 'flex', gap: 3, padding: '8px 0', backgroundColor: '#fafafa', borderRadius: 2 }}>
                <Box sx={{ minWidth: 160, fontWeight: 'bold' }}></Box>
                {pkg?.hotels?.map((hotelGroup, dayIndex) => (
                  <Box
                    key={dayIndex}
                    sx={{
                      minWidth: 220,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: '#555',
                      padding: '8px',
                    }}
                  >
                    Day {dayIndex + 1}
                  </Box>
                ))}
              </Box>

              {/* Row for Hotel Name */}
              <Box sx={{ display: 'flex', gap: 3, padding: '8px 0' }}>
                <Box sx={{ minWidth: 160, fontWeight: 'bold', color: '#666' }}>Hotel Name</Box>
                {pkg?.hotels?.map((hotelGroup, index) => (
                  <Box key={index} sx={{ minWidth: 220 }}>
                    {hotelGroup?.hotels?.map((hotel, hotelIndex) => (
                      <Box key={hotelIndex} sx={{ textAlign: 'center', color: '#444' }}>
                        {hotel.hotelName || 'N/A'}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>

              {/* Row for Location */}
              <Box sx={{ display: 'flex', gap: 3, padding: '8px 0', backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                <Box sx={{ minWidth: 160, fontWeight: 'bold', color: '#666' }}>Location</Box>
                {pkg?.hotels?.map((hotelGroup, index) => (
                  <Box key={index} sx={{ minWidth: 220 }}>
                    {hotelGroup?.hotels?.map((hotel, hotelIndex) => (
                      <Box key={hotelIndex} sx={{ textAlign: 'center', color: '#444' }}>
                        {hotel.location || 'N/A'}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>

              {/* Row for Room Name */}
              <Box sx={{ display: 'flex', gap: 3, padding: '8px 0' }}>
                <Box sx={{ minWidth: 160, fontWeight: 'bold', color: '#666' }}>Room Name</Box>
                {pkg?.hotels?.map((hotelGroup, index) => (
                  <Box key={index} sx={{ minWidth: 220 }}>
                    {hotelGroup?.hotels?.map((hotel, hotelIndex) => (
                      <Box key={hotelIndex} sx={{ textAlign: 'center', color: '#444' }}>
                        {hotel?.selectedRooms?.map((room, roomIndex) => (
                          <Box key={roomIndex} sx={{ marginBottom: 1 }}>
                            {room?.roomName || 'N/A'}
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>

              {/* Row for Meal Plan */}
              <Box sx={{ display: 'flex', gap: 3, padding: '8px 0', backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                <Box sx={{ minWidth: 160, fontWeight: 'bold', color: '#666' }}>Meal Plan (MP)</Box>
                {pkg?.hotels?.map((hotelGroup, index) => (
                  <Box key={index} sx={{ minWidth: 220 }}>
                    {hotelGroup?.hotels?.map((hotel, hotelIndex) => (
                      <Box key={hotelIndex} sx={{ textAlign: 'center', color: '#444' }}>
                        {hotel?.selectedRooms?.map((room, roomIndex) => (
                          <Box key={roomIndex} sx={{ marginBottom: 1 }}>
                            {room?.mp || 'N/A'}
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>

              {/* Row for Adults */}
              <Box sx={{ display: 'flex', gap: 3, padding: '8px 0' }}>
                <Box sx={{ minWidth: 160, fontWeight: 'bold', color: '#666' }}>Adults</Box>
                {pkg?.hotels?.map((hotelGroup, index) => (
                  <Box key={index} sx={{ minWidth: 220 }}>
                    {hotelGroup?.hotels?.map((hotel, hotelIndex) => (
                      <Box key={hotelIndex} sx={{ textAlign: 'center', color: '#444' }}>
                        {hotel?.selectedRooms?.map((room, roomIndex) => (
                          <Box key={roomIndex} sx={{ marginBottom: 1 }}>
                            {room?.selectedOccupancy?.adults || 'N/A'}
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>

              {/* Row for Child */}
              <Box sx={{ display: 'flex', gap: 3, padding: '8px 0', backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                <Box sx={{ minWidth: 160, fontWeight: 'bold', color: '#666' }}>Child</Box>
                {pkg?.hotels?.map((hotelGroup, index) => (
                  <Box key={index} sx={{ minWidth: 220 }}>
                    {hotelGroup?.hotels?.map((hotel, hotelIndex) => (
                      <Box key={hotelIndex} sx={{ textAlign: 'center', color: '#444' }}>
                        {hotel?.selectedRooms?.map((room, roomIndex) => (
                          <Box key={roomIndex} sx={{ marginBottom: 1 }}>
                            {room?.selectedOccupancy?.child || 'N/A'}
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>

              {/* Row for Room Price */}
              <Box sx={{ display: 'flex', gap: 3, padding: '8px 0' }}>
                <Box sx={{ minWidth: 160, fontWeight: 'bold', color: '#666' }}>Room Price</Box>
                {pkg?.hotels?.map((hotelGroup, index) => (
                  <Box key={index} sx={{ minWidth: 220 }}>
                    {hotelGroup?.hotels?.map((hotel, hotelIndex) => (
                      <Box key={hotelIndex} sx={{ textAlign: 'center', color: '#444' }}>
                        {hotel?.selectedRooms?.map((room, roomIndex) => (
                          <Box key={roomIndex} sx={{ marginBottom: 1 }}>
                            {room?.roomPrice || 'N/A'}
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ))
      ) : (
        <Typography variant="body1" sx={{ color: '#777', paddingTop: 2 }}>
          No package details available
        </Typography>
      )}
    </Box>
  );
};

export default PackageData;
