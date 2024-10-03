import { gemini } from '../firebaseConfig.js';

// Wrap in an async function so you can use await
const aiHotelDetails = async ({reqData, selectedHotels = []}) => {
    console.log('day data for gemRes ', reqData, selectedHotels)
    // Provide a prompt that contains text
    const prompt = `Write a summarized travel itinerary for a day of the Trip with following details: 
     Pick up: ${reqData?.pickUp || "Bali Airport"}. Location: ${selectedHotels[0].location}. Include the sightseeing of the Location for the day.
     Summarize in maximum 5 bullet points without any bulle titles.
    `
  
    // To generate text output, call generateContent with the text input
    const result = await gemini.generateContent(prompt);
  
    const response = result.response;
    const text = response.text();
    console.log("gemini response", prompt, text);
    return text;
}

export {
    aiHotelDetails
}