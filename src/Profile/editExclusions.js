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
import { setProfileData, handleRemovePolicyItem, updatePolicyText, handleAddPolicyItem } from '../PackageBuilder/packBuilderSlice.js';
import { DEFAULT_POLICIES } from "../Constants.js";

const EditCancellationPolicy = ({ setIsBrandEdited = () => {} }) => {
    const userProfileData = useSelector((state) => state.packBuilderData.userProfileData) || null;
    const { inclusions = DEFAULT_POLICIES["inclusionsDefault"], exclusions = DEFAULT_POLICIES["exclusionsDefault"] } = userProfileData || {};
    const [loding, setLoading] = useState(false);
	const userData = JSON.parse(localStorage.getItem("user"));  //useSelector((state) => state.packBuilderData.userData) || {};
	const dispatch = useDispatch();
    // const { 
    //     cancellationData = DEFAULT_POLICIES["cancellationPolicyDefault"], 
    //     paymentPolicy = DEFAULT_POLICIES["paymentPolicyDefault"] 
    // } = userProfileData || {};

    

	const getProfileData = async () => {
		// console.log(reqData, 'gemRes -- ');
        console.log("Get Profile Date", userData, userData.phone);
        if(userProfileData) return;
        setLoading(true);
        let docSnapPdfData = await getDoc(doc(db, "userProfileData", userData.phone));
        if (docSnapPdfData.exists()) {
            console.log("Profile Date", docSnapPdfData.data());
            let profileData = docSnapPdfData.data();
            if(!profileData?.inclusions) profileData["inclusions"] = DEFAULT_POLICIES["inclusionsDefault"];
            if(!profileData?.exclusions) profileData["exclusions"] = DEFAULT_POLICIES["exclusionsDefault"];
            dispatch(setProfileData(profileData));
        }
        setLoading(false);
        // setCancellationData(cData);
	}

    useEffect(() => {
        if(!userProfileData) {
            console.log("ger profile edit exclusions ", userProfileData);
            getProfileData();
        }
    }, [])
    
    const handlePolicyItemRemove = (data) => {
        dispatch(handleRemovePolicyItem(data))
        if(setIsBrandEdited) setIsBrandEdited(true);  
    }

    const handlePolicyItemUpdate = (data) => {
        dispatch(updatePolicyText(data));
        if(setIsBrandEdited) setIsBrandEdited(true);   
    }

	// const handleTextChange = (itiDesc, itiDescIndex) => {
	// 	if(!itiDesc) return;
	// 	// dispatch(updatePolicyText({ "cancellationPolicy", itiDesc, itiDescIndex }));
	// }

    console.log('edit exclusions render ', inclusions, exclusions);
    return (<Box display={'flex'} flexDirection={'column'} sx={{ mt: 2 }}>
        {/* <Grid item xs={12} md={12} lg={12} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
            <Button size="small" variant="outlined" onClick={getProfileData} sx={{ width: 'fit-content', margin: 'auto', mb: 1 }}>
                Edit Your Policies
                {
                    loding && <CircularProgress color="secondary" size="10px" sx={{ ml: 1 }} />
                }
            </Button>
        </Grid> */}
        {
            inclusions && inclusions.length > 0 && (<Grid item xs={12} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
                {
                    inclusions && (<Box sx={{ border: `1px solid`, borderColor: 'primary', borderRadius: 1, p: 1, mb: 1 }}>
                        <InputLabel id={'iti-desc'} sx={{ fontSize: 12 }}>Inclusions:</InputLabel>
                        {
                            inclusions.map((itiText, itiTextIndex) => {
                                return (<Box sx={{ display: 'flex', p: 1, position: 'relative' }}>
                                    {/* <Box
                                        component="span"
                                        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
                                    >•</Box>  */}
                                    <IconButton aria-label="delete" size="small" color="primary" 
                                        onClick={() => handlePolicyItemRemove({policyType: "inclusions", deleteIndex: itiTextIndex})}
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
                                        onChange={(e) => handlePolicyItemUpdate({policyType: "inclusions", val: e.target.value, textIndex: itiTextIndex})}
                                    />
                                    {/* {bull} <small>{parse(itiText)}</small> */}
                                </Box>)
                            })
                        }
                        <Box sx={{ display: 'flex', px: 1, position: 'relative' }}>
                            <IconButton aria-label="delete" size="small" color="primary" 
                                onClick={() => dispatch(handleAddPolicyItem({policyType: "inclusions"}))}
                            >
                                <AddCircleOutlineIcon fontSize='small'/>
                            </IconButton>
                        </Box>
                    </Box>)
                }
            </Grid>)
        }
        {
            exclusions && exclusions.length > 0 && (<Grid item xs={12} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
                {
                    exclusions && (<Box sx={{ border: `1px solid`, borderColor: 'primary', borderRadius: 1, p: 1 }}>
                        <InputLabel id={'iti-desc'} sx={{ fontSize: 12 }}>Exclusions:</InputLabel>
                        {
                            exclusions.map((itiText, itiTextIndex) => {
                                return (<Box sx={{ display: 'flex', p: 1, position: 'relative' }}>
                                    {/* <Box
                                        component="span"
                                        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
                                    >•</Box>  */}
                                    <IconButton aria-label="delete" size="small" color="primary" 
                                        onClick={() => handlePolicyItemRemove({policyType: "exclusions", deleteIndex: itiTextIndex})}
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
                                        onChange={(e) => handlePolicyItemUpdate({policyType: "exclusions", val: e.target.value, textIndex: itiTextIndex})}
                                    />
                                    {/* {bull} <small>{parse(itiText)}</small> */}
                                </Box>)
                            })
                        }
                        
                        <Box sx={{ display: 'flex', px: 1, position: 'relative' }}>
                            <IconButton aria-label="delete" size="small" color="primary" 
                                onClick={() => dispatch(handleAddPolicyItem({policyType: "exclusions"}))}
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