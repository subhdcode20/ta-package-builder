import { createSlice } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../firebaseConfig.js";
import { isEmptyObject } from '../Utility.js';
import { store } from '../appStore/store.js';

// selectedHotels
// [ 
//   [day 1 hotels], 
//   [day 2 hotels],
//   .. 
// ]

// selectedRooms
// [ 
//   [ 
//     [day 1 hotel 1 rooms ..], 
//     [day 1 hotel 2 rooms ..] 
//   ], 
//   [ 
//     [day 2 hotel 1 rooms ..]
//   ], 
//   .. 
// ]

export const todoSlice = createSlice({
  name: 'packBuilder',
  initialState: {
    userData: {phone: "+917880473111", name: "Subham Dey", userId: "ajaj"},
    reqData: null,
    currDayIndex: 0,
    daysArr: [],
    selectedHotels: [], // [ [day 1 hotels], [day 2 hotels].. ]
    selectedRooms: [],  // [ [ [day 1 hotel 1 room 1] , [day 1 hotel 2 room 1] ], .. ]
    hotelRates: []
  },
  reducers: {
    submitReqData: (state, action) => {
      // if(!action.reqData || isEmptyObject(action.reqData)) return;
      console.log("submitReqData reducer ", state, action.payload);
      state.reqData = action.payload?.reqData;
    },
    onCurrDayIndexChange: (state, action) => {
      state.currDayIndex = action.payload;
    },
    createEmptyPackageDataDayWise: (state, action) => {
      let newDaysArr = [], newHotelsArr = [];
      let noOfDays = Number(action.payload.noOfNights)+1;
      for(let i = 0; i < noOfDays; i++) {
        console.log("newDaysArr 1", noOfDays, i, i < noOfDays);
        newDaysArr.push({
          key: `Day ${i}`
        });
        newHotelsArr.push(null);
      }
      state.daysArr = newDaysArr;
      const defaultHotelsArr = [ ...newDaysArr.map((i, iIndex) => [{ key: `D-${iIndex + 1}_H-${1}` }] ) ];
      state.selectedHotels = defaultHotelsArr;
      // state.selectedRooms = [ ...defaultHotelsArr.map((i, iIndex) => i.map(ii => [{ key: `D-${iIndex + 1}_H-${iIndex + 1}_R-${1}` }] ) ) ];
      console.log("create initial data", action.payload, newDaysArr, newHotelsArr, state.selectedHotels, state.selectedRooms);
    },
    handleHotelSelect: (state, action) => {
      let { hotelIndex = null, data = null } = action.payload;
      const currHotelData = state.selectedHotels[state.currDayIndex][hotelIndex];
      console.log("hotel select slice 1", state, state.currDayIndex, state.selectedHotels, hotelIndex, data)
      state.selectedHotels[state.currDayIndex][hotelIndex] = {
        ...data, 
        key: currHotelData?.key,
        "selectedRooms": [{ key: `D-${state.currDayIndex + 1}_H-${hotelIndex + 1}-R-${1}` }]
      };
      console.log("hotel select slice 2", state, state.currDayIndex, state.selectedHotels, hotelIndex, data)
      // state.selectedHotels[state.currDayIndex][hotelIndex]["selectedRooms"] = [{ key: `D-${state.currDayIndex + 1}_H-${hotelIndex + 1}_R-${1}` }];
    },
    addNewRoomToHotel: (state, action) => {
      const hotelIndex = action.payload?.hotelIndex;
      const currentHotelRooms = state.selectedHotels[state.currDayIndex][hotelIndex]["selectedRooms"];
      currentHotelRooms.push({
        key: `D-${state.currDayIndex + 1}_H-${action.payload?.hotelIndex + 1}-R-${currentHotelRooms.length + 1}`
      })
    },
    addNewHotelToCurrDay: (state, action) => {
      const hotelIndex = action.payload?.hotelIndex;
      const currHotels = state.selectedHotels[state.currDayIndex];
      currHotels.push({
        "key": `D-${state.currDayIndex + 1}_H-${currHotels.length + 1}`,  //`D-${state.currDayIndex + 1}_H-${action.payload?.hotelIndex + 1}-R-${currentHotelRooms.length + 1}`,
        "selectedRooms": [{ key: `D-${state.currDayIndex + 1}_H-${currHotels.length + 1}_R-${1}` }]
      })
    },
    setUserHotelRates: async (state, action) => {
      const { ratesData = {} } = action.payload;
      if(!ratesData || isEmptyObject(ratesData)) return; // TODO show page error
      state.hotelRates = [...ratesData?.hotels] || [];
      console.log("reqtest- getUserHotelRates reducer", ratesData);
    },
    handleRoomSelect: (state, action) => {
      const { hotelIndex = null, roomIndex = null, data = null } = action.payload;
      if(hotelIndex === null || roomIndex === null || !data || isEmptyObject(data) ) return;
      console.log("room select reducer initial ", hotelIndex, roomIndex, data);
      const currentHotelRooms = state.selectedHotels[state.currDayIndex][hotelIndex]["selectedRooms"];
      let currentRoom = currentHotelRooms[roomIndex];
      currentHotelRooms[roomIndex] = {
        ...currentHotelRooms[roomIndex],
        ...data
      };
    },
    selectedRoomOccupancy: (state, action) => {
      let { hotelIndex = null, roomIndex = null, keyType = null, value = null } = action.payload;
      console.log("room occ select reducer initial ", hotelIndex, roomIndex, keyType, value);
      if(hotelIndex === null || roomIndex === null || !keyType || !value) return;
      const currentHotelRooms = state.selectedHotels[state.currDayIndex][hotelIndex]["selectedRooms"];
      const selectedOccupancy = currentHotelRooms[roomIndex].selectedOccupancy 
        ? {
          ...currentHotelRooms[roomIndex].selectedOccupancy,
          [keyType]: value
        }
        : {
          [keyType]: value
        }
      currentHotelRooms[roomIndex] = {
        ...currentHotelRooms[roomIndex],
        selectedOccupancy
      };
    }
  }
});

// this is for dispatch
export const { 
  submitReqData,
  onCurrDayIndexChange, 
  createEmptyPackageDataDayWise, 
  handleHotelSelect,
  addNewRoomToHotel,
  addNewHotelToCurrDay,
  setUserHotelRates,
  handleRoomSelect,
  selectedRoomOccupancy
} = todoSlice.actions;

// this is for configureStore
export default todoSlice.reducer;