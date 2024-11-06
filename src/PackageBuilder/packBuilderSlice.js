import { createSlice } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../firebaseConfig.js";
import { isEmptyObject, itiRoomPriceFieldsMap } from '../Utility.js';
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
    userData: { phone: "+917880473111", name: "Subham Dey", userId: "ajaj" },
    reqData: null,
    packageData: null,
    newPackageData: {},
    currDayIndex: 0,
    daysArr: [],
    selectedHotels: [], // [ [day 1 hotels], [day 2 hotels].. ]
    selectedRooms: [],  // [ [ [day 1 hotel 1 room 1] , [day 1 hotel 2 room 1] ], .. ]
    hotelRates: [],
    itineraryDesc: [],
    totalDayPrices: [],
    reqHistory: [],
  },
  reducers: {
    submitReqData: (state, action) => {
      // if(!action.reqData || isEmptyObject(action.reqData)) return;
      console.log("submitReqData reducer ", state, action.payload);
      state.reqData = action.payload?.reqData;
    },
    submitPackageData: (state, action) => { // Added this line
      console.log("setPackageData reducer", state, action.payload);
      state.packageData = action.payload?.packageData;
      console.log("PackageDataInsidePackageData:", state.packageData);
    },
    savePackageData: (state, action) => {
      const { packageData } = action.payload;
      console.log("savePackageData reducer", packageData);
      const newHotelArr = packageData.hotels[0].hotels;  //state.packageData.hotels[0].hotels;
      // state.savedHotels = newSelectedHotelsArr;
      let length = newHotelArr.length;
      let newSelectedHotels = [];
      let newSelectedRooms = [];
      console.log("LENGTHIN", length);
      for (let i = 0; i < length; i++) {
        console.log("EACHDATA", newHotelArr[i]);
        newSelectedHotels.push({
          hotels: [
            { key: newHotelArr[i].key || "", hotelName : newHotelArr[i].hotelName || "", selectedRooms: newHotelArr[i].selectedRooms || "", roomRates: newHotelArr[i].roomRates || ""}
          ]
        });
        newSelectedRooms.push(newHotelArr[i].selectedRooms);
      }
      state.packageData = packageData
      state.selectedHotels = newSelectedHotels;
      state.selectedRooms = newSelectedRooms;
      
      console.log("savedHotelsCHECK1",  JSON.parse(JSON.stringify(newHotelArr)));
      console.log("savedHotelsCHECK2", state.selectedHotels);
      console.log("savedHotelsCHECK3", state.selectedRooms);
      // console.log("savedHotelsCHECK3", JSON.parse(JSON.stringify(state.selectedRooms)));
    },
    setReqsHistory: (state, action) => {
      // if(!action.reqData || isEmptyObject(action.reqData)) return;
      console.log("submitReqList reducer ", state, action.payload);
      state.reqHistory = action.payload?.reqList;
    },
    onCurrDayIndexChange: (state, action) => {
      state.currDayIndex = action.payload;
    },
    createEmptyPackageDataDayWise: (state, action) => {
      let newDaysArr = [], newHotelsArr = [];
      let { noOfNights = 0, roomOcc = [] } = action.payload;
      let emptyRooms = roomOcc.map(j => {
        let newObj = {}
        newObj["roomName"] = "";
        newObj["selectedOccupancy"]= {
          adults: j?.adultPax,
          child: j?.childPax,
          childAges: j?.childAges
        };
        return newObj
      })
      let noOfDays = Number(noOfNights) + 1;
      for (let i = 0; i < noOfDays; i++) {
        console.log("newDaysArr 1", noOfDays, i, i < noOfDays);
        newDaysArr.push({
          key: `Day ${i}`
        });
        newHotelsArr.push({
          hotels: [
            { 
              key: `D-${i + 1}_H-${1}`, 
              hotelName: "",
              selectedRooms: emptyRooms
            }
          ]
        });
      }
      state.daysArr = newDaysArr;
      // const defaultHotelsArr = [ ...newDaysArr.map((i, iIndex) => [{ key: `D-${iIndex + 1}_H-${1}` }] ) ];
      state.selectedHotels = newHotelsArr;  //defaultHotelsArr;
      state.totalDayPrices = newDaysArr;
      state.itineraryDesc = newDaysArr;
      // state.selectedRooms = [ ...defaultHotelsArr.map((i, iIndex) => i.map(ii => [{ key: `D-${iIndex + 1}_H-${iIndex + 1}_R-${1}` }] ) ) ];
      console.log("create initial data", action.payload, newDaysArr, newHotelsArr, state.selectedHotels, state.selectedRooms);
    },
    handleHotelSelect: (state, action) => {
      let { hotelIndex = null, data = null } = action.payload;
      console.log("hotel select slice 1", state, state.currDayIndex, state.selectedHotels, hotelIndex, data)
      let currDayHotels = state.selectedHotels[state.currDayIndex]?.hotels;
      const currHotelData = currDayHotels[hotelIndex];
      // let selectedRoomsData =
      currDayHotels[hotelIndex] = {
        ...currHotelData,
        ...data,
        // key: currHotelData?.key,
        "selectedRooms": currHotelData?.selectedRooms.map((ij) => {
          let newObj = {
            key: `D-${state.currDayIndex + 1}_H-${hotelIndex + 1}-R-${1}`,
          };
          newObj["roomName"] = '';
          newObj["selectedOccupancy"] = ij?.selectedOccupancy;
          return newObj;
        })
      };
      console.log("hotel select slice 2", currDayHotels[hotelIndex], state, state.currDayIndex, state.selectedHotels, hotelIndex, data)
      // state.selectedHotels[state.currDayIndex][hotelIndex]["selectedRooms"] = [{ key: `D-${state.currDayIndex + 1}_H-${hotelIndex + 1}_R-${1}` }];
    },
    addNewRoomToHotel: (state, action) => {
      const hotelIndex = action.payload?.hotelIndex;
      let currDayHotels = state.selectedHotels[state.currDayIndex]?.hotels;
      const currentHotelRooms = currDayHotels[hotelIndex]["selectedRooms"];
      currentHotelRooms.push({
        key: `D-${state.currDayIndex + 1}_H-${action.payload?.hotelIndex + 1}-R-${currentHotelRooms.length + 1}`
      })
    },
    addNewHotelToCurrDay: (state, action) => {
      // const hotelIndex = action.payload?.hotelIndex;
      let currHotels = state.selectedHotels[state.currDayIndex]?.hotels;
      currHotels.push({
        "key": `D-${state.currDayIndex + 1}_H-${currHotels.length + 1}`,  //`D-${state.currDayIndex + 1}_H-${action.payload?.hotelIndex + 1}-R-${currentHotelRooms.length + 1}`,
        "selectedRooms": [{ 
          key: `D-${state.currDayIndex + 1}_H-${currHotels.length + 1}_R-${1}`, 
          roomName: '' 
        }]
      })
    },
    setUserHotelRates: async (state, action) => {
      const { ratesData = {} } = action.payload;
      if (!ratesData || isEmptyObject(ratesData)) return; // TODO show page error
      state.hotelRates = [...ratesData?.hotels] || [];
      console.log("reqtest- getUserHotelRates reducer", ratesData);
    },
    handleRoomSelect: (state, action) => {
      const { hotelIndex = null, roomIndex = null, data = null } = action.payload;
      if (hotelIndex === null || roomIndex === null || !data || isEmptyObject(data)) return;
      console.log("room select reducer initial ", hotelIndex, roomIndex, data);
      const currDayHotels = state.selectedHotels[state.currDayIndex]?.hotels;
      const currentHotelRooms = currDayHotels[hotelIndex]["selectedRooms"];
      currentHotelRooms[roomIndex] = {
        ...currentHotelRooms[roomIndex],
        ...data
      };
    },
    selectedRoomOccupancy: (state, action) => {
      let { hotelIndex = null, roomIndex = null, keyType = null, value = null } = action.payload;
      console.log("room occ select reducer initial ", hotelIndex, roomIndex, keyType, value);
      if (hotelIndex === null || roomIndex === null || !keyType ) return; //|| !value
      const currDayHotels = state.selectedHotels[state.currDayIndex]?.hotels;
      const currentHotelRooms = currDayHotels[hotelIndex]["selectedRooms"];
      const selectedOccupancy = currentHotelRooms[roomIndex].selectedOccupancy
        ? {
          ...currentHotelRooms[roomIndex].selectedOccupancy,
          [keyType]: value
        }
        : {
          [keyType]: value
        }
      const currChildAges = selectedOccupancy?.childAges || [];
      let newChildAges = null;
      if(keyType == "child" && !isNaN(value)) {
        let totalChild = value || 0;
        newChildAges = [];
        // if(currChildAges) {
        for(let cc = 0; cc < totalChild; cc++) {
          if (!currChildAges[cc] || !isEmptyObject(currChildAges[cc])) {
            newChildAges.push({ ...currChildAges[cc] });
          } else {
            newChildAges.push({ age: '', extraBed: false });
          }
        }
        // }
      }

      currentHotelRooms[roomIndex] = {
        ...currentHotelRooms[roomIndex],
        selectedOccupancy: {
          ...selectedOccupancy,
          childAges: newChildAges || currChildAges
        }
      };
    },
    setRoomOccChildAge: (state, action) => {
      let { hotelIndex = null, roomIndex = null, childIndex = null, age = null, extraBed = null } = action.payload;
      console.log("room occ select reducer initial ", hotelIndex, roomIndex, childIndex, age, extraBed);
      if (hotelIndex === null || roomIndex === null || childIndex === null || extraBed === null) return; //|| !value
      const currDayHotels = state.selectedHotels[state.currDayIndex]?.hotels;
      const currentHotelRooms = currDayHotels[hotelIndex]["selectedRooms"];
      let selectedOccChildAge = currentHotelRooms[roomIndex].selectedOccupancy?.childAges[childIndex];
      console.log("room occ select reducer final ", age, extraBed, currentHotelRooms[roomIndex].selectedOccupancy?.childAges, hotelIndex, roomIndex, childIndex, age, extraBed);
      currentHotelRooms[roomIndex].selectedOccupancy.childAges[childIndex] = {
        age,
        extraBed
      };
    },
    handleRemoveRoom: (state, action) => {
      let { hotelIndex = null, deleteIndex = null } = action.payload;
      console.log("handleRemoveRoom", hotelIndex, deleteIndex);
      if(isNaN(hotelIndex) || isNaN(deleteIndex)) return;
      const currDayHotels = state.selectedHotels[state.currDayIndex]?.hotels;
      const currentHotelRooms = currDayHotels[hotelIndex]["selectedRooms"];
      if(deleteIndex > currentHotelRooms.length) return;
      let newRooms = [ ...currentHotelRooms ];
      newRooms.splice(deleteIndex, 1);
      console.log("handleRemoveRoom final", newRooms, currentHotelRooms);
      currDayHotels[hotelIndex]["selectedRooms"] = newRooms;
    },
    setHotelPriceForCurrDay: (state, action) => {
      let { totalHotelPriceForCurrDay = null, selectedHotelCurrDay = [], copyDetailsToDays = {} } = action.payload;
      let currDayPrice = state.totalDayPrices[state.currDayIndex] || {};
      currDayPrice["totalPrice"] = totalHotelPriceForCurrDay;
      console.log("save day daya 11", copyDetailsToDays && !isEmptyObject(copyDetailsToDays), copyDetailsToDays, selectedHotelCurrDay);
      if (copyDetailsToDays && !isEmptyObject(copyDetailsToDays)) {
        Object.keys(copyDetailsToDays).forEach(dayNo => {
          // if(dayNo <= 0) continue;
          let copyDayPrice = state.totalDayPrices[Number(dayNo) - 1] || {};
          console.log("save day daya copy", dayNo, copyDayPrice);
          state.totalDayPrices[Number(dayNo) - 1]["totalPrice"] = totalHotelPriceForCurrDay;

          let copyDaySelectedHotels = state.selectedHotels[Number(dayNo) - 1];
          // let newDayData = state.selectedHotels[state.currDayIndex].map((h) => {
          //   let { selectedRooms = [] } = h || {};
          //   let newDaySelectedRooms = 
          // })
          console.log("save day daya copy 2", dayNo, selectedHotelCurrDay)
          state.selectedHotels[Number(dayNo) - 1] = {
            "hotels": selectedHotelCurrDay
          };
        })
      }
    },
    setMealPlanFor1Room: (state, action) => {
      let { hotelIndex = null, roomIndex = null, mealPlan = null } = action.payload;
      const currDayHotels = state.selectedHotels[state.currDayIndex]?.hotels;
      const currentHotelRooms = currDayHotels[hotelIndex]["selectedRooms"];
      let currentRoom = { ...currentHotelRooms[roomIndex] };
      let { occupancy: roomMaxOcc = {}, selectedOccupancy = {}, stdRoomPrice = {}, extraRates = {},  } = currentRoom;
      let { adults, child, childAges = []} = selectedOccupancy;
      let currRoomPrice = 0, 
        totalExtraAdults = Number(selectedOccupancy.adults) - Number(roomMaxOcc.adult);
      if(totalExtraAdults < 0) totalExtraAdults = 0;
      let totalAdultPrice = Number(currentRoom[itiRoomPriceFieldsMap[mealPlan]]) + ( Number(currentRoom[itiRoomPriceFieldsMap["extraAdultPrices"][mealPlan]]) * Number(totalExtraAdults) );
      let totalChildPrice = [...childAges].reduce((acc, ch) => {
        console.log("calculate child price 1", ch.age, currentRoom?.minChildAgeForExtra, [...childAges][0], ch, ch.extraBed, mealPlan, itiRoomPriceFieldsMap[`extraChildBed-${ch.extraBed}`][mealPlan] )
        if(ch.age >= currentRoom?.minChildAgeForExtra) 
          return  acc + Number( currentRoom[ itiRoomPriceFieldsMap[`extraChildBed-${ch.extraBed.toString()}`][mealPlan] ] );
        else return acc + 0
      }, 0)
      
      // Number(currentRoom[itiRoomPriceFieldsMap[mealPlan]]) + ( Number(currentRoom[itiRoomPriceFieldsMap["extraAdultPrices"][mealPlan]]) * Number(totalExtraAdults) );
      console.log("calculate child price",  totalChildPrice)
      console.log("calculate room price ", currentRoom, roomMaxOcc.adult, mealPlan, itiRoomPriceFieldsMap, itiRoomPriceFieldsMap[mealPlan], currentRoom[itiRoomPriceFieldsMap[mealPlan]], selectedOccupancy.adults, totalExtraAdults, itiRoomPriceFieldsMap["extraAdultPrices"][mealPlan], currentRoom[itiRoomPriceFieldsMap["extraAdultPrices"][mealPlan]], totalAdultPrice);
    

      // if (stdRoomPrice) {
      //   let rPrice = stdRoomPrice[mealPlan], childPrice = extraRates["extraChild"];
      //   console.log("setMealPlanFor1Room 1Room", currentHotelRooms[roomIndex], currRoomPrice, stdRoomPrice[mealPlan], mealPlan, rPrice, extraRates["extraChild"], childPrice, Number(rPrice), Number(selectedOccupancy?.adults));
      //   currRoomPrice += (Number(rPrice) * Number(selectedOccupancy?.adults));
      //   console.log("setMealPlanFor1Room 1Room only Adults", currRoomPrice);
      //   currRoomPrice += (Number(childPrice) * Number(selectedOccupancy?.child));
      //   console.log("setMealPlanFor1Room 1Room - Adults + child", currRoomPrice);
      // }

      currentHotelRooms[roomIndex] = {
        ...currentHotelRooms[roomIndex],
        mp: mealPlan,
        roomPrice: totalAdultPrice + totalChildPrice
      }
    },
    setPriceFor1Room: (state, action) => {
      let { hotelIndex = null, roomIndex = null, roomPrice = null } = action.payload;
      const currDayHotels = state.selectedHotels[state.currDayIndex]?.hotels;
      const currentHotelRooms = currDayHotels[hotelIndex]["selectedRooms"];
      currentHotelRooms[roomIndex] = {
        ...currentHotelRooms[roomIndex],
        roomPrice: Number(roomPrice)
      }
    },
    setItineraryDesc: (state, action) => {
      let { text: genItiText = [] } = action?.payload;
      if(!genItiText) return;
      console.log("set gen iti text ", genItiText, genItiText)
      state.itineraryDesc[state.currDayIndex] = {
        text: genItiText
      }
    },
    updateItineraryDesc: (state, action) => {
      let { itiDesc, itiDescIndex } = action.payload;
      let currDayItiData = state.itineraryDesc[state.currDayIndex]?.text;
      currDayItiData[itiDescIndex] = itiDesc;
    },
    setHotelLocation: (state, action) => {
      let { hotelIndex = null, data = null } = action.payload;
      console.log("setHotelLocation 1", state, state.currDayIndex, state.selectedHotels, hotelIndex, data);
      let currDayHotels = state.selectedHotels[state.currDayIndex]?.hotels;
      const currHotelData = currDayHotels[hotelIndex];
      // let selectedRoomsData =
      currDayHotels[hotelIndex] = {
        ...currHotelData,
        hotelName: '',
        // selectedRooms: [],
        // roomRates: {},
        location: data,
      };
      console.log("setHotelLocation 2", currDayHotels[hotelIndex], state, state.currDayIndex, state.selectedHotels, hotelIndex, data)
    }
  }
});

// this is for dispatch
export const {
  submitReqData,
  submitPackageData,
  savePackageData,
  onCurrDayIndexChange,
  createEmptyPackageDataDayWise,
  handleHotelSelect,
  addNewRoomToHotel,
  addNewHotelToCurrDay,
  setUserHotelRates,
  handleRoomSelect,
  selectedRoomOccupancy,
  setRoomOccChildAge,
  handleRemoveRoom,
  setHotelPriceForCurrDay,
  setMealPlanFor1Room,
  setReqsHistory,
  setPriceFor1Room,
  setItineraryDesc,
  updateItineraryDesc,
  setHotelLocation
} = todoSlice.actions;

// this is for configureStore
export default todoSlice.reducer;