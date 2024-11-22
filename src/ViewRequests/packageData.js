import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const PackageData = ({ packageDetails }) => {
  console.log("DATAPACKAGEIN:", packageDetails);

  return (
    <Box
      sx={{
        padding: 3,
        marginTop: 3,
        border: '1px solid #ddd',
        borderRadius: 2,
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333', marginBottom: 3 }}>
        Package Details
      </Typography>

      {packageDetails?.length > 0 ? (
        packageDetails.map((pkg, pkgIndex) => {
          let { hotels = [] } = pkg;

          return (
            <Box key={pkgIndex} sx={{ marginBottom: 4 }}>

              <Box>
                {/* Table Header */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    borderBottom: '1px solid #ddd',
                    paddingBottom: 1,
                    fontWeight: 'bold',
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 160 }}>Detail</Box>
                  {pkg?.hotels?.map((_, dayIndex) => (
                    <Box key={dayIndex} sx={{ flex: 1, minWidth: 200, textAlign: 'center' }}>
                      Day {dayIndex + 1}
                    </Box>
                  ))}
                </Box>

                {/* Hotel Name Row */}
                <Box sx={{ display: 'flex', gap: 2, borderBottom: '1px solid #ddd', paddingY: 1 }}>
                  <Box sx={{ flex: 1, minWidth: 160, fontWeight: 'bold', color: '#666' }}>Hotel Name</Box>
                  {pkg?.hotels?.map((hotelGroup, index) => (
                    <Box key={index} sx={{ flex: 1, minWidth: 200, textAlign: 'center' }}>
                      {hotelGroup?.hotels?.map((hotel, hotelIndex) => (
                        <Typography key={hotelIndex} sx={{ color: '#444' }}>
                          {hotel?.hotelName || 'N/A'}
                          {hotel?.starCategory && (
                            <Typography
                              component="span"
                              sx={{ fontSize: '0.85em', color: '#777', display: 'block' }}
                            >
                              ({hotel?.starCategory}⭐)
                            </Typography>
                          )}
                        </Typography>
                      ))}
                    </Box>
                  ))}
                </Box>

                {/* Location Row */}
                <Box sx={{ display: 'flex', gap: 2, borderBottom: '1px solid #ddd', paddingY: 1 }}>
                  <Box sx={{ flex: 1, minWidth: 160, fontWeight: 'bold', color: '#666' }}>Location</Box>
                  {pkg?.hotels?.map((hotelGroup, index) => (
                    <Box key={index} sx={{ flex: 1, minWidth: 200, textAlign: 'center' }}>
                      {hotelGroup?.hotels?.map((hotel, hotelIndex) => (
                        <Typography key={hotelIndex} sx={{ color: '#444' }}>
                          {hotel?.location || 'N/A'}
                        </Typography>
                      ))}
                    </Box>
                  ))}
                </Box>

                {/* Room Details Row */}
                <Box sx={{ display: 'flex', gap: 2, paddingY: 1 }}>
                  <Box sx={{ flex: 1, minWidth: 160, fontWeight: 'bold', color: '#666' }}>Room </Box>
                  {pkg?.hotels?.map((hotelGroup, index) => (
                    <Box key={index} sx={{ flex: 1, minWidth: 200 }}>
                      {hotelGroup?.hotels?.map((hotel, hotelIndex) => (
                        <Box
                          key={hotelIndex}
                          sx={{
                            border: '1px solid #ddd',
                            borderRadius: 2,
                            overflow: 'hidden',
                            marginBottom: 3,
                            padding: 2,
                            backgroundColor: '#fafafa',
                          }}
                        >
                          {hotel?.selectedRooms?.map((room, roomIndex) => (
                            <Box
                              key={roomIndex}
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                borderBottom:
                                  roomIndex !== hotel?.selectedRooms?.length - 1
                                    ? '1px solid #ddd'
                                    : 'none',
                                paddingBottom: 2,
                                marginBottom: 2,
                              }}
                            >
                              <Typography sx={{ color: '#444', fontWeight: 'bold' }}>
                                {room?.roomName || 'N/A'}
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 0.5,
                                  color: '#666',
                                }}
                              >
                                <Typography>{room?.mp || 'N/A'}</Typography>
                                <Typography>{room?.selectedOccupancy?.adults || '0'} Adult, {room?.selectedOccupancy?.child || '0'} Child</Typography>
                                <Typography></Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      ))}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Total Price */}
              <Divider sx={{ margin: '24px 0' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'right', color: '#444' }}>
                Total Price: ₹{pkg?.finalTransferPrice || '0'}
              </Typography>
            </Box>
          );
        })
      ) : (
        <Typography variant="body1" sx={{ color: '#777', paddingTop: 2 }}>
          No packages created for this Request!
        </Typography>
      )}
    </Box>
  );
};

export default PackageData;
