// import { initializeApp } from "firebase/app";
import { getVertexAI, getGenerativeModel, Schema } from "firebase/vertexai";

import { gemini, vertexAI } from '../firebaseConfig.js';

export const getActivitiesListForLoc = async ({
    destination,
    location,
    startingFrom
}) => {
    console.log("")
    if(!destination) return '';
    // Provide a JSON schema object using a standard format.
    const jsonSchema = Schema.object({
        properties: {
            activities: Schema.array({
                items: Schema.object({
                    properties: {
                        name: Schema.string(),
                        description: Schema.string(),
                        bestTimeToVisit: Schema.number(),
                        activityPriority: Schema.string(),
                    },
                    optionalProperties: ["activityPriority"],
                }),
            }),
        }
   });
   
   // Initialize the generative model.
   // Use a model that supports `responseSchema`, like one of the Gemini 1.5 models.
   const model = getGenerativeModel(vertexAI, {
     model: "gemini-1.5-flash",
     // In the generation config, set the `responseMimeType` to `application/json`
     // and pass the JSON schema object into `responseSchema`.
     generationConfig: {
       responseMimeType: "application/json",
       responseSchema: jsonSchema
     },
   });
   
   
   let prompt = `List out all activities/sighseeing points 
   ${location ? `for ${location}` : ''} 
   ${destination ? `in ${destination}` : '' } for 1 day. 
   ${startingFrom ? `Clients arriving from ${startingFrom}.` : ''}`;
   console.log("activity final prompt: ", prompt, location, destination, startingFrom);
   let result = await model.generateContent(prompt)
   console.log("GEM JSON", JSON.parse(result.response.text()));
   return JSON.parse(result.response.text());
}

export const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
}

export const run = async () => {
    // Provide a text prompt to include with the image
    const prompt = "What do you see?";
  
    // Prepare image for input
    const fileInputEl = document.querySelector("input[type=file]");
    const imagePart = await fileToGenerativePart(fileInputEl.files[0]);
  
    const model = getGenerativeModel(vertexAI, {
        model: "gemini-1.5-flash",
        // In the generation config, set the `responseMimeType` to `application/json`
        // and pass the JSON schema object into `responseSchema`.
        // generationConfig: {
        //   responseMimeType: "application/json",
        //   responseSchema: jsonSchema
        // },
    });
    // To stream generated text output, call generateContentStream with the text and image
    const result = await model.generateContentStream([prompt, imagePart]);
  
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      console.log(chunkText);
    }
}
