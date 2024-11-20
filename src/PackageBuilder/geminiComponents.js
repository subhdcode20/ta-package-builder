import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';

import { gemini } from '../firebaseConfig.js';
import { setItineraryDesc, updateItineraryDesc, handleRemoveItiItem } from './packBuilderSlice.js';

// Wrap in an async function so you can use await
const aiHotelDetails = async ({reqData, selectedHotels = [], currentDayIndex = 1}) => {
    let { pickUp = '', noOfNights = 0, dropLoc } = reqData;
    let { location, hotelName } = selectedHotels[currentDayIndex]?.hotels[0]
    let currDayPickup = pickUp;
    if(currentDayIndex > 0) currDayPickup = selectedHotels[currentDayIndex - 1]?.hotels[0].hotelName;
    console.log('day data for gemRes ', pickUp, currDayPickup, location, " -- ", reqData, selectedHotels, currentDayIndex)

    // Provide a prompt that contains text
    const day1Prompt = `Write a summarized travel itinerary for the 1st day of the Trip with following details: 
     Welcome and Pick up: ${pickUp || "Airport"}. Destination for the Day: ${location}. Stay tonight at: Hotel ${hotelName}.
     Structure your response in json more specifically an Array of Strings with every string mentioning parts of the Itenerary.
     Include the sightseeing of the Location for the day.
     Summarize in maximum 5 points or strings in the array. Your response string should be a valid JSON string.
    `
    const dayNPrompt = `Write a summarized travel itinerary for a day of the Trip with following details: 
     Pick up from Hotel: ${currDayPickup || "Hotel"}. Destination for the Day: ${location}. Stay tonight at: Hotel ${hotelName}.
     Dont mention time of the day.
     Structure your response in json more specifically an Array of Strings with every string mentioning parts of the Itenerary.
     Include the sightseeing of the Location for the day.
     Summarize in maximum 5 points or strings in the array. Your response string should be a valid JSON string.
    `
    const lastDayPrompt = `Write a summarized travel itinerary for the last day of the Trip with following details: 
     Day Start from: ${pickUp}. Drop off and Trip conclusion at: ${dropLoc}. 
     Dont mention time of the day.
     Structure your response in json more specifically an Array of Strings with every string mentioning parts of the Itenerary.
     Include the sightseeing of the Location for the day.
     Summarize in maximum 5 points or strings in the array. Your response string should be a valid JSON string.
    `
    // const isLastDay = Number(currentDayIndex) === Number(reqData.noOfNights);
    const prompt = currentDayIndex == 0 
        ? day1Prompt 
        : currentDayIndex == noOfNights 
            ? lastDayPrompt 
            : dayNPrompt;  //isLastDay ? lastDayPrompt : dayPrompt;
    console.log("gemini final prompt ", prompt);
    // To generate text output, call generateContent with the text input
    const result = await gemini.generateContent(prompt);
  
    const response = result.response;
    const text = response.text();
    let finalText = text.slice(0, text.length - 3).split('json')[1];
    console.log("gemini response", prompt, text, finalText, typeof text, JSON.parse(finalText));
    return JSON.parse(finalText);
}

const GenerateItineraryBtn = ({  }) => {
    const currentDayIndex = useSelector((state) => state.packBuilderData.currDayIndex);
    const selectedHotels = useSelector((state) => state.packBuilderData.selectedHotels);
    const itineraryDesc = useSelector((state) => state.packBuilderData.itineraryDesc) || [];
    const reqData = useSelector((state) => state.packBuilderData.reqData) || {};
	const userData = useSelector((state) => state.packBuilderData.userData) || {};
    const [geminiLoading, setGeminiLoading] = useState(false);
	const dispatch = useDispatch();

	const generateItineraryDay1 = async () => {
		console.log(reqData, 'gemRes -- ');
		setGeminiLoading(true);
		let gemRes = await aiHotelDetails({ reqData, selectedHotels, currentDayIndex });
		setGeminiLoading(false);
		dispatch(setItineraryDesc({ text: gemRes }));
	}

	const handleItiDescChange = (itiDesc, itiDescIndex) => {
		if(!itiDesc) return;
		dispatch(updateItineraryDesc({ itiDesc, itiDescIndex }));
	}

    return (<Grid item xs={12} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
        <Button size="small" variant="contained" onClick={generateItineraryDay1} sx={{ width: 'fit-content', margin: 'auto', mb: 1 }}>
            Generate Itinerary for Day {currentDayIndex + 1}
            {
                geminiLoading && <CircularProgress color="secondary" size="10px" sx={{ ml: 1 }} />
            }
        </Button>
    
        {
            itineraryDesc[currentDayIndex]?.text && (<Box sx={{ border: `1px solid`, borderColor: 'primary', borderRadius: 1, p: 1 }}>
                <InputLabel id={'iti-desc'} sx={{ fontSize: 12 }}>Itinerary Description For Day {currentDayIndex + 1}:</InputLabel>
                {
                    itineraryDesc[currentDayIndex]?.text.map((itiText, itiTextIndex) => {
                        return (<Box sx={{ display: 'flex', p: 1, position: 'relative' }}>
                            {/* <Box
                                component="span"
                                sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
                            >•</Box>  */}
                            <IconButton aria-label="delete" size="small" color="primary" 
                                onClick={() => dispatch(handleRemoveItiItem({itiTextIndex}))}
                            >
                                <DeleteIcon fontSize='small'/>
                            </IconButton>
                            &nbsp;
                            <TextField
                                sx={{ width: "100%" }}
                                id=""
                                value={itiText || ''}
                                variant="standard"
                                multiline
                                size="small"
                                onChange={(e) => handleItiDescChange(e.target.value, itiTextIndex)}
                            />
                            {/* {bull} <small>{parse(itiText)}</small> */}
                        </Box>)
                    })
                }
            </Box>)
        }
    </Grid>)
}

export {
    aiHotelDetails,
    GenerateItineraryBtn
}