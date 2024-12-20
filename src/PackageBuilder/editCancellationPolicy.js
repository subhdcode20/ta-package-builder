import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../firebaseConfig';
import { setProfileData, handleRemovePolicyItem, updatePolicyText, handleAddPolicyItem } from './packBuilderSlice.js';

const EditCancellationPolicy = ({  }) => {
    // const currentDayIndex = useSelector((state) => state.packBuilderData.currDayIndex);
    // const selectedHotels = useSelector((state) => state.packBuilderData.selectedHotels);
    // const itineraryDesc = useSelector((state) => state.packBuilderData.itineraryDesc) || [];
    const userProfileData = useSelector((state) => state.packBuilderData.userProfileData) || null;
    const { cancellationData = [{ text: "" }], paymentPolicy = [{ text: "" }] } = userProfileData || {};
    // const reqData = useSelector((state) => state.packBuilderData.reqData) || {};
	const userData = JSON.parse(localStorage.getItem("user"));  //useSelector((state) => state.packBuilderData.userData) || {};
    const [loding, setLoading] = useState(false);
	const dispatch = useDispatch();
    // const [cancellationData, setCancellationData] = useState([]);

	const getCancellationPolicy = async () => {
		// console.log(reqData, 'gemRes -- ');
        console.log("Get Profile Date", userData, userData.phone);
        if(userProfileData) return;
        setLoading(true);
        let docSnapPdfData = await getDoc(doc(db, "userProfileData", userData.phone));
        if (docSnapPdfData.exists()) {
            console.log("Profile Date", docSnapPdfData.data());
            dispatch(setProfileData(docSnapPdfData.data()));
        }
        setLoading(false);
        // setCancellationData(cData);
	}

    useEffect(() => {
        if(!userProfileData) {
            console.log("ger profile edit cancellation ", userProfileData);
            getCancellationPolicy();
        }
    }, [])

	// const handleTextChange = (itiDesc, itiDescIndex) => {
	// 	if(!itiDesc) return;
	// 	// dispatch(updatePolicyText({ "cancellationPolicy", itiDesc, itiDescIndex }));
	// }

    console.log('edit cancellation render ', cancellationData);
    return (<Box display={'flex'} flexDirection={'column'} sx={{ mt: 2 }}>
        {/* <Grid item xs={12} md={12} lg={12} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
            <Button size="small" variant="outlined" onClick={getCancellationPolicy} sx={{ width: 'fit-content', margin: 'auto', mb: 1 }}>
                Edit Your Policies
                {
                    loding && <CircularProgress color="secondary" size="10px" sx={{ ml: 1 }} />
                }
            </Button>
        </Grid> */}
        {
            cancellationData && cancellationData.length > 0 && (<Grid item xs={12} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
                {
                    cancellationData && (<Box sx={{ border: `1px solid`, borderColor: 'primary', borderRadius: 1, p: 1, mb: 1 }}>
                        <InputLabel id={'iti-desc'} sx={{ fontSize: 12 }}>Cancellation Policy:</InputLabel>
                        {
                            cancellationData.map((itiText, itiTextIndex) => {
                                return (<Box sx={{ display: 'flex', p: 1, position: 'relative' }}>
                                    {/* <Box
                                        component="span"
                                        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
                                    >•</Box>  */}
                                    <IconButton aria-label="delete" size="small" color="primary" 
                                        onClick={() => dispatch(handleRemovePolicyItem({policyType: "cancellationData", deleteIndex: itiTextIndex}))}
                                    >
                                        <DeleteIcon fontSize='small'/>
                                    </IconButton>
                                    &nbsp;
                                    <TextField
                                        sx={{ width: "100%" }}
                                        id=""
                                        value={itiText?.text || ''}
                                        variant="standard"
                                        multiline
                                        size="small"
                                        onChange={(e) => dispatch(updatePolicyText({policyType: "cancellationData", val: e.target.value, textIndex: itiTextIndex}))}
                                    />
                                    {/* {bull} <small>{parse(itiText)}</small> */}
                                </Box>)
                            })
                        }
                        <Box sx={{ display: 'flex', px: 1, position: 'relative' }}>
                            <IconButton aria-label="delete" size="small" color="primary" 
                                onClick={() => dispatch(handleAddPolicyItem({policyType: "cancellationData"}))}
                            >
                                <AddCircleOutlineIcon fontSize='small'/>
                            </IconButton>
                        </Box>
                    </Box>)
                }
            </Grid>)
        }
        {
            paymentPolicy && paymentPolicy.length > 0 && (<Grid item xs={12} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
                {
                    paymentPolicy && (<Box sx={{ border: `1px solid`, borderColor: 'primary', borderRadius: 1, p: 1 }}>
                        <InputLabel id={'iti-desc'} sx={{ fontSize: 12 }}>Payment Policy:</InputLabel>
                        {
                            paymentPolicy.map((itiText, itiTextIndex) => {
                                return (<Box sx={{ display: 'flex', p: 1, position: 'relative' }}>
                                    {/* <Box
                                        component="span"
                                        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
                                    >•</Box>  */}
                                    <IconButton aria-label="delete" size="small" color="primary" 
                                        onClick={() => dispatch(handleRemovePolicyItem({policyType: "paymentPolicy", deleteIndex: itiTextIndex}))}
                                    >
                                        <DeleteIcon fontSize='small'/>
                                    </IconButton>
                                    &nbsp;
                                    <TextField
                                        sx={{ width: "100%" }}
                                        id=""
                                        value={itiText?.text || ''}
                                        variant="standard"
                                        multiline
                                        size="small"
                                        onChange={(e) => dispatch(updatePolicyText({policyType: "paymentPolicy", val: e.target.value, textIndex: itiTextIndex}))}
                                    />
                                    {/* {bull} <small>{parse(itiText)}</small> */}
                                </Box>)
                            })
                        }
                        
                        <Box sx={{ display: 'flex', px: 1, position: 'relative' }}>
                            <IconButton aria-label="delete" size="small" color="primary" 
                                onClick={() => dispatch(handleAddPolicyItem({policyType: "paymentPolicy"}))}
                            >
                                <AddCircleOutlineIcon fontSize='small'/>
                            </IconButton>
                        </Box>
                    </Box>)
                }
            </Grid>)
        }
    </Box>)
}

export default EditCancellationPolicy;