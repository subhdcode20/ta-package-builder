import * as React from 'react';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useNavigate } from "react-router-dom";
import { isEmptyObject } from '../Utility';

const PackageData = ({ packageDetails = [], reqData = {} }) => {
  const { pickUp, cabType, dropLoc } = reqData || {};
  const navigate = useNavigate();
  
  console.log('PackageData render ', reqData)
  return (
    <Box
      sx={{
        padding: 3,
        marginTop: 3,
        border: '1px solid #ddd',
        borderRadius: 3,
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h5" fontWeight="bold" sx={{ fontWeight: 'bold', color: '#333', marginBottom: 3, textAlign:"center" }}>
        Selected Package Details
      </Typography>

      {packageDetails?.length > 0 ? (
        packageDetails.map((pkg, pkgIndex) => {
          const reqId = pkg?.reqId || '';
          const createdAt = pkg?.createdAt
            ? format(new Date(pkg.createdAt), 'dd-MM-yyyy')
            : 'N/A';

          console.log('PackageData render 22 ', pkg);
          return (
            <Accordion key={pkgIndex} sx={{ marginBottom: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`package-content-${pkgIndex}`}
                id={`package-header-${pkgIndex}`}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
                    Package created on <b> {createdAt} </b>
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    href={`/itinerary/${reqId}` || ''}
                    size="small"
                    sx={{ marginLeft: 2 }}
                  >
                    View PDF
                  </Button>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    overflowX: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    backgroundColor: '#fff',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      backgroundColor: '#f0f4f7',
                      padding: 2,
                      fontWeight: 'bold',
                      borderBottom: '1px solid #ddd',
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 160 }}>Detail</Box>
                    {pkg?.hotels?.map((_, dayIndex) => (
                      <Box
                        key={dayIndex}
                        sx={{
                          flex: 1,
                          minWidth: 200,
                          maxWidth: 400,
                          textAlign: 'center',
                          wordWrap: 'break-word',
                          fontSize: '0.95em',
                          fontWeight: '600',
                          color: '#444',
                        }}
                      >
                        Day {dayIndex + 1}
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', padding: 2, borderBottom: '1px solid #ddd' }}>
                    <Box sx={{ flex: 1, minWidth: 160, fontWeight: 'bold', color: '#666' }}>Hotel</Box>
                    {pkg?.hotels?.map((hotelGroup, index) => (
                      <Box
                        key={index}
                        sx={{
                          flex: 1,
                          minWidth: 200,
                          textAlign: 'center',
                          wordWrap: 'break-word',
                        }}
                      >
                        {hotelGroup?.hotels?.map((hotel, hotelIndex) => (
                          <Typography key={hotelIndex} sx={{ color: '#333', fontWeight: '500' }}>
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

                  <Box sx={{ display: 'flex', padding: 2, borderBottom: '1px solid #ddd' }}>
                    <Box sx={{ flex: 1, minWidth: 160, fontWeight: 'bold', color: '#666' }}>Location</Box>
                    {pkg?.hotels?.map((hotelGroup, index) => (
                      <Box
                        key={index}
                        sx={{
                          flex: 1,
                          minWidth: 200,
                          textAlign: 'center',
                          wordWrap: 'break-word',
                        }}
                      >
                        {hotelGroup?.hotels?.map((hotel, hotelIndex) => (
                          <Typography key={hotelIndex} sx={{ color: '#555' }}>
                            {hotel?.location || 'N/A'}
                          </Typography>
                        ))}
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', padding: 2 }}>
                    <Box sx={{ flex: 1, minWidth: 160, fontWeight: 'bold', color: '#666' }}>Room</Box>
                    {pkg?.hotels?.map((hotelGroup, index) => (
                      <Box
                        key={index}
                        sx={{
                          flex: 1,
                          minWidth: 200,
                          textAlign: 'center',
                          wordWrap: 'break-word',
                        }}
                      >
                        {hotelGroup?.hotels?.map((hotel, hotelIndex) => (
                          <Box key={hotelIndex} sx={{ padding: 2 }}>
                            {hotel?.selectedRooms?.map((room, roomIndex) => (
                              <Box
                                key={roomIndex}
                                sx={{
                                  borderBottom:
                                    roomIndex !== hotel?.selectedRooms?.length - 1
                                      ? '1px solid #ddd'
                                      : 'none',
                                  paddingBottom: 2,
                                  marginBottom: 2,
                                }}
                              >
                                <Typography sx={{ color: '#444', fontWeight: '500' }}>
                                  {room?.roomName || 'N/A'}
                                </Typography>
                                <Typography sx={{ fontSize: '0.85em', color: '#666' }}>
                                  {room?.mp || 'N/A'}
                                </Typography>
                                <Typography sx={{ fontSize: '0.85em', color: '#666' }}>
                                  {room?.selectedOccupancy?.adults || '0'} Adult,{' '}
                                  {room?.selectedOccupancy?.child || '0'} Child
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    padding: 3,
                    textAlign: 'left',
                    marginBottom: 3,
                    marginTop:3,
                    backgroundColor: '#fff',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#444' }}>
                    Transfer Section
                  </Typography>
                  <Typography sx={{ color: '#555', marginTop: 1 }}>
                    All tours and transfers are private by {cabType || ''} from {pickUp || ''} dropping at {dropLoc || ''}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    padding: 3,
                    textAlign: 'left',
                    backgroundColor: '#fff',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#444', marginBottom: 2 }}>
                    Price Section
                  </Typography>
                  {
                    (pkg?.finalTransferPrice && !isEmptyObject(pkg?.finalTransferPrice) && !isNaN(pkg?.finalTransferPrice)) && (<>
                      <Typography sx={{ color: '#555', marginBottom: 1 }}>
                        Hotel Price: ₹{Number(pkg?.finalPackPrice) - Number(pkg?.finalTransferPrice) || '0'}
                      </Typography>
                      <Typography sx={{ color: '#555', marginBottom: 1 }}>
                        Transfer Price: ₹{pkg?.finalTransferPrice || '0'}
                      </Typography>
                    </>)
                  }
                  <Typography sx={{ color: '#000', fontWeight: 'bold' }}>
                    Total Package Price: ₹{pkg?.finalPackPrice || '0'}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })
      ) : (<Box sx={{ m: 2, display: 'flex', width: 'max-content', justifyContent: 'space-evenly' }}>
        <Typography variant='body2' sx={{ margin: 'auto' }}>No packages created for this Request! Try Fastest way to a professional Itinerary/Quote pdf</Typography>
        &nbsp;
        <Button size="small" variant='contained' onClick={() => navigate('/itinerary/' + reqData?.reqId)}>Now!</Button>
      </Box>)}
    </Box>
  );
};

export default PackageData;
