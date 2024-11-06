import { gemini } from '../firebaseConfig.js';

// Wrap in an async function so you can use await
const aiHotelDetails = async ({reqData, selectedHotels = [], currentDayIndex = 1}) => {
    let { pickUp = '', noOfNights = 0 } = reqData;
    let { location, hotelName } = selectedHotels[currentDayIndex]?.hotels[0]
    let currDayPickup = pickUp;
    if(currentDayIndex > 0) currDayPickup = selectedHotels[currentDayIndex - 1]?.hotels[0].hotelName;
    console.log('day data for gemRes ', pickUp, currDayPickup, location, " -- ", reqData, selectedHotels, currentDayIndex)

    // Provide a prompt that contains text
    const day1Prompt = `Write a summarized travel itinerary for the 1st day of the Trip with following details: 
     Welcome and Pick up: ${pickUp || "Airport"}. Location: ${location}. Stay tonight at: Hotel ${hotelName}.
     Structure your response in json more specifically an Array of Strings with every string mentioning parts of the Itenerary.
     Include the sightseeing of the Location for the day.
     Summarize in maximum 5 points or strings in the array. Your response string should be a valid JSON string.
    `
    const dayNPrompt = `Write a summarized travel itinerary for a day of the Trip with following details: 
     Pick up from Hotel: ${currDayPickup || "Hotel"}. Location: ${location}. Stay tonight at: Hotel ${hotelName}.
     Dont mention time of the day.
     Structure your response in json more specifically an Array of Strings with every string mentioning parts of the Itenerary.
     Include the sightseeing of the Location for the day.
     Summarize in maximum 5 points or strings in the array. Your response string should be a valid JSON string.
    `
    const lastDayPrompt = `Write a summarized travel itinerary for the last day of the Trip with following details: 
     Day Start from: ${pickUp}. Drop: Airport/Railway Station. 
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

export {
    aiHotelDetails
}