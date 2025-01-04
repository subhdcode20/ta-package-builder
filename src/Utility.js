import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { todoSlice } from './PackageBuilder/packBuilderSlice';
// import {Base64Encode} from 'base64-stream';
// import concatStream from 'concat-stream';
import destImagesMap from './PackagePdf/destPdfImagesMap.js';

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

export const formattedAmountINR = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

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

export const getB64Img = async (data, firebaseIdToken) => {
  if(!firebaseIdToken || !data?.logoUrl) return;

  // "error": {
  //       "code": "auth/id-token-expired"

  try {
    const axiosOptions = {
		  method: 'POST',
		  headers: { 
			  // 'content-type': 'application/x-www-form-urlencoded',
			  'Authorization': firebaseIdToken 
		  },
		  data: data,
		  url: `${process.env.REACT_APP_API_DOMAIN}/api/get-logo-b64`,
		};
		console.log('request axios ', axiosOptions);
	
		let response = await axios(axiosOptions);
		console.log('getB64Img response axios ', response);
		return {data: response.data?.data};
  } catch (error) {
    console.error("getB64Img error ", error);

    if(error?.response?.data?.error?.code == "auth/id-token-expired") {
      // todo: refresh the firebase token
    }
    return {err: error}
  }  
}

export const selectPdfImgB64 = async ({dest, firebaseIdToken}) => {
  try {

    if(!dest || !firebaseIdToken || !destImagesMap[dest]) return null;
    console.log("dest img select common ", Math.random(), destImagesMap[dest].length, Math.floor(Math.random() * destImagesMap[dest].length), firebaseIdToken)
    let finalDestImg = destImagesMap[dest][ Math.floor(Math.random() * destImagesMap[dest].length) ];
    if(!finalDestImg) return;
    let { data = null, err = null } = await getB64Img({ logoUrl: finalDestImg }, firebaseIdToken );
    return {"b64Data": data, err: err};
  } catch (e) {
    console.log("select pdf image error: ", e);
    return {"b64Data": null, err: e}
  }
}