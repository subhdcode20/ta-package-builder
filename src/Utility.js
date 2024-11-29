import React from 'react';
import { useLocation } from 'react-router-dom';
// import {Base64Encode} from 'base64-stream';
// import concatStream from 'concat-stream';

export const MainContext = React.createContext({});
export const DayWiseItineraryContext = React.createContext({});

export const isEmptyObject = (obj) => {
  for (let name in obj) {
    if (obj.hasOwnProperty(name)) {
      return false;
    }
  }
  return true;
};

export const useUrlParams = () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const itiRoomPriceFieldsMap = {
  "cpai": "cpaiPrice",
  "mapai": "mapaiPrice",
  "apai": "apaiPrice",
  "extraAdultPrices": {
    "cpai": "extraBedCpaiPrice",
    "mapai": "extraBedMapaiPrice",
    "apai": "extraBedApaiPrice",
  },
  "extraChildBed-false": {
    "cpai": "childNoBedCpaiPrice",
    "mapai": "childNoBedMapaiPrice",
    "apai": "childNoBedApaiPrice",
  },
  "extraChildBed-true": {
    "cpai": "extraBedChildCpaiPrice",
    "mapai": "extraBedChildMapaiPrice",
    "apai": "extraBedChildApaiPrice",
  },
}

// /**
//  * Convert a Readable Stream to base64 string
//  * @param {ReadableStream} stream - a readable stream to convert in base64 string
//  * @returns {Promise} - Promise that resolve in a string containing the base64
//  */
// export const streamToBase64 = (streamData) => {
//   const concat = require('concat-stream')
//   const { Base64Encode } = require('base64-stream')

//   return new Promise((resolve, reject) => {
//     // const base64 = new Base64Encode()

//     const cbConcat = (base64) => {
//       resolve(base64)
//     }

//     streamData
//       .pipe(new Base64Encode({ prefix: `data:${"image/png"};base64,` }))
//       .pipe(concat(cbConcat))
//       .on('error', (error) => {
//         reject(error)
//       })
//   })
// }

export const readAsDataUri = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(reader.error);
      }
    });
    reader.readAsDataURL(file);
  });
}

export const readStreamData = async (url) => {
  const response = await fetch(url);
  let totalData = new Uint8Array([]);
  const dataString = ''
  for await (const chunk of response.body) {
    // Do something with each "chunk"
    console.log("logo url stream chunk ", chunk, typeof chunk);
    totalData = new Uint8Array([ ...totalData, ...chunk]);
  }
  console.log("logo url stream chunk done", totalData, typeof totalData);
  // Exit when done
  return btoa(String.fromCharCode.apply(null, totalData));
  // Buffer.from(totalData).toString('base64');
}

export const fileToBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});