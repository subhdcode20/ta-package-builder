import { gemini } from '../firebaseConfig.js';

// Wrap in an async function so you can use await
const aiHotelDetails = async ({reqData, selectedHotels = []}) => {
    console.log('day data for gemRes ', reqData, selectedHotels)
    // Provide a prompt that contains text
    const prompt = `Write a summarized travel itinerary for a day of the Trip with following details: 
     Pick up: ${reqData?.pickUp || "Bali Airport"}. Location: ${selectedHotels[0].location}. 
     Structure your response in json more specifically an Array of Strings with every string mentioning parts of the Itenerary.
     Include the sightseeing of the Location for the day.
     Summarize in maximum 5 points or strings in the array. Your response string should be a valid JSON string.
    `
  
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