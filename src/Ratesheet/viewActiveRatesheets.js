import React, { useState, useEffect , useContext} from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useMediaQuery from '@mui/material/useMediaQuery';

import MainDestSelect from "../Commons/mainDestSearch.js";
import { db, auth } from "../firebaseConfig";
import { MainContext } from '../Utility.js';
import { nanoid } from 'nanoid';
import { Grid } from '@mui/material';

const RateSheetTable = ({ reqsList = [] }) => {
	const [destination, setDestination] = useState("");
  const [userRates, setUserRates] = React.useState({});
  const {userData} = useContext(MainContext);
  const [expanded, setExpanded] = React.useState(false);
  const navigate = useNavigate();
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    // React.useEffect(() => {
    //     if(!reqsList) return
    //     setTableData(reqsList.map((dd) => {
    //     // dd['createdAt'] = format(new Date(dd.createdAt), "dd-MMM-yyyy");
    //     return dd;
    //     }))
    // }, [reqsList])

  const handleCopy = (reqId) => {
    // console.log("REQID: ", reqId);
    // navigate(`/request/${reqId}/edit`)
  };

//   const handleCopyNew = (reqId) => {
//     console.log("REQID: ", reqId);
//     navigate(`/request/${reqId}/copy-new`)
//   };

  const columns = [
    // {
    //   field: 'createdAt',
    //   headerName: 'Created On',
    //   width: 150,
    //   editable: false,
    //   valueGetter: (value, row) => `${format(new Date(value), "dd-MMM-yyyy")}`
    // },
    {
      field: 'location',
      headerName: 'Location',
      width: 150,
      editable: true,
    },
    {
      field: 'validFrom',
      headerName: 'validFrom',
      width: 150,
      editable: true,
      valueGetter: (value, row) => `${format(new Date(value), "dd-MMM-yyyy")}`,
    },
    {
      field: 'validUntil',
      headerName: 'Valid Till',
      width: 150,
      editable: true,
      valueGetter: (value, row) => `${format(new Date(value), "dd-MMM-yyyy")}`,
    },
    {
      field: 'hotelName',
      headerName: 'hotelName',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'cpaiPrice',
      headerName: 'CPAI Rate',
      width: 110,
      editable: true,
    },
    {
      field: 'mapaiPrice',
      headerName: 'MAPAI Price',
      width: 110,
      editable: true,
      valueGetter: (value) => `${value?.label}`,
    },
    {
      field: 'apaiPrice',
      headerName: 'APAI Price',
      width: 110,
      editable: true,
    },
    {
      field: '',
      headerName: 'Actions',
      width: 250,
      editable: true,
      renderCell: (params) => (
        params.row.hotelName ? (
          <div>
            <Button size="small" variant="contained" color="primary" onClick={() => handleCopy(params.row.reqId)}>
              Delete
            </Button>
            &nbsp;
          </div>
        ) : null
      ),
    },
  ];

    const handleDestSelect = (e) => {
        let selectedDest = e?.target?.value;
        if (!selectedDest) return;
        console.log("selectedDest req ", selectedDest);
        setDestination(selectedDest);
    };

    useEffect(() => {
        if(!userData?.phone || !destination) return;

        const getUserDestRates = async () => {
            console.log("getUserDestRates ", `${userData.phone}-${destination.toLowerCase()}`);

            const docSnap = await getDoc(doc(db, "userRates", `${userData.phone}-${destination.toLowerCase()}`));
            if (docSnap.exists()) {
                let data = docSnap.data();
                data['hotels'] = data?.hotels.map(i => {
                    return {
                        ...i,
                        id: i.hotelRateId || nanoid(5)
                    }
                })
                setUserRates(prevState => {
                    return {
                        ...prevState,
                        [destination.toLowerCase()]: data
                    }
                });
            } else {
                console.log('Rate Doc not found!');
            } 
        }

        getUserDestRates();
    }, [destination, userData])

  console.log("req list table", userData, destination, userRates, userRates[destination.toLowerCase()]);
  const tableData = userRates[destination.toLowerCase()]?.hotels  || [];
  return (<>
    <hr style={{ margin: 'auto', maxWidth: '50%', marginTop: '16px', marginBottom: '16px' }} />
    <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        // minHeight: "90vh",
        padding: 2,
        borderRadius: 4,
        border: "1px solid #ccc",
        bgcolor: "transparent",
        paddingX: 3,
        alignItems: 'center'
    }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '20px', marginTop:1 }}>
                Upload Ratesheet
            </Typography>
        </Box>
        {/* <Box sx={{ display: 'flex', flexDirection: 'row', margin: "auto", width: "100%"}}>
          <Typography variant="body1" sx={{ mt: 2 }}>
              Check your Rate sheet Data:
          </Typography>
          &nbsp;
        </Box> */}
        
        <Box flex={1} sx={{ ml: 2, width: isMobile ? '100%' : '55%' }}>
          <MainDestSelect handleDestSelect={handleDestSelect} destination={destination} />
        </Box>
        {
          (tableData && tableData.length > 0) &&  <Typography variant="subtitle1" sx={{ my: 1 }}>
            Active Ratesheets for <b>{`${destination}`}</b>:
          </Typography>
        }
        {
          (destination && tableData.length == 0) && (
            <Typography variant="subtitle1" sx={{ my: 3, mx: 'auto' }}>
              No Rate sheet uploaded for <b>{destination} !</b>
            </Typography>
          )
        }
        <Box sx={{ margin: "auto", height: 400, width: "100%" }}>
            {
              tableData.map((rate) => <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {rate.hotelName}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Validity: {format(rate?.validFrom, "dd-MMM-yyyy")} - {format(rate?.validUntil, "dd-MMM-yyyy")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container display={'flex'}>

                        {
                          Object.keys(rate.roomRates).map((room) => (<>
                                <Grid item xs={12} md={12} display={'flex'} flexDirection={isMobile ? 'row' : 'column'} justifyContent={isMobile ? 'space-between' : 'flex-start'} width={'inherit'}>
                                    <hr style={{ width: '100%' }} />
                                </Grid>
                                <Grid item xs={12} md={3} display={'flex'} flexDirection={isMobile ? 'row' : 'column'} justifyContent={isMobile ? 'space-between' : 'flex-start'} width={'inherit'}>
                                    <Typography>Room Name</Typography>
                                    &nbsp;
                                    <Typography><b>{room}</b></Typography>
                                </Grid>
                                <Grid item xs={12} md={3} display={'flex'} flexDirection={isMobile ? 'row' : 'column'} justifyContent={isMobile ? 'space-between' : 'flex-start'} width={'inherit'}>
                                    <Typography>Cpai Price</Typography>
                                    &nbsp;
                                    <Typography><b>Rs. {rate.roomRates[room]?.cpaiPrice}</b></Typography>
                                </Grid>
                                <Grid item xs={12} md={3} display={'flex'} flexDirection={isMobile ? 'row' : 'column'} justifyContent={isMobile ? 'space-between' : 'flex-start'} width={'inherit'}>
                                    <Typography>Mapai Price</Typography>
                                    &nbsp;
                                    <Typography><b>Rs. {rate.roomRates[room]?.mapaiPrice}</b></Typography>
                                </Grid>
                                <Grid item xs={12} md={3} display={'flex'} flexDirection={isMobile ? 'row' : 'column'} justifyContent={isMobile ? 'space-between' : 'flex-start'} width={'inherit'}>
                                    <Typography>Apai Price</Typography>
                                    &nbsp;
                                    <Typography><b>Rs. {rate.roomRates[room]?.apaiPrice}</b></Typography>
                                </Grid>
                            </>))
                        }
                        
                    </Grid>
                </AccordionDetails>
            </Accordion>)}
          {/* <DataGrid
            rows={tableData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                  },
                  },
                  }}
                  pageSizeOptions={[7]}
                  checkboxSelection={false}
                  disableRowSelectionOnClick
                  /> */}
        </Box>
    </Box>
  </>);
}

export default RateSheetTable;