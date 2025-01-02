import { createSlice } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../firebaseConfig.js";
import { isEmptyObject, itiRoomPriceFieldsMap } from '../Utility.js';
import { DEFAULT_TEMPLATE_NAME } from '../Constants.js';
import { store } from '../appStore/store.js';
import { act } from 'react';

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
// phone: "+917880473111", name: "Subham Dey", userId: "ajaj"
export const todoSlice = createSlice({
  name: 'packBuilder',
  initialState: {
    userData: {}, 
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
    finalPackPrice: '',
    finalTransferPrice: '',
    fbIdToken: null
  },
  reducers: {
    setUserData: (state, action) => {
      console.log("set userData", action?.payload)
      state.userData = action?.payload;
    },
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
      state.selectedHotels = packageData.hotels  //newSelectedHotels;
      // state.selectedRooms = newSelectedRooms;
      if(packageData?.totalDayPrices && packageData?.totalDayPrices.length > 0) state.totalDayPrices = packageData?.totalDayPrices || []
      state.itineraryDesc = packageData?.itiTexts || []
      state.finalTransferPrice = isNaN(packageData?.finalTransferPrice) ? '' : packageData?.finalTransferPrice;
      state.finalPackPrice = isNaN(packageData?.finalPackPrice) ? '' : packageData?.finalPackPrice;
      state.itiFlightsData = packageData?.flights || {}
      
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
        roomName: data?.roomName
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
    calculatePriceFor1Day: (state, action) => {
      const currDayHotels = state.selectedHotels[state.currDayIndex]?.hotels;
      console.log("checkPricefor1Day", currDayHotels);
      let totalHotelPriceForCurrDay = currDayHotels.reduce((acc, h) => {
        let totalRoomsPriceForCurrHotel = h.selectedRooms.reduce((rAcc, r) => {
          let { mp = null, roomPrice = null, selectedOccupancy = {}, stdRoomPrice = {}, extraRates = {} } = r;
          console.log("checkPricefor1Day 1Hotel 1Room", rAcc + Number(roomPrice, mp, roomPrice, selectedOccupancy, currDayHotels));
          if (!mp) {
            // TODO: show validation error
            return 0;
          }
          // if(stdRoomPrice) {
          // 	let rPrice = stdRoomPrice[mp], childPrice = extraRates["extraChild"];
          // 	console.log("checkPricefor1Day 1Room", mp, rPrice, rAcc + Number(rPrice) * Number(selectedOccupancy?.adults));
          // 	rAcc += Number(rPrice) * Number(selectedOccupancy?.adults);
          // 	return rAcc + Number(childPrice) * Number(selectedOccupancy?.child);
          // } else if(roomPrice) {
          return rAcc + Number(roomPrice);
          // }
        }, 0);
        console.log("checkPricefor1Day 1Hotel", acc + totalRoomsPriceForCurrHotel);
        return acc + totalRoomsPriceForCurrHotel;
      }, 0);
      
      state.totalDayPrices[state.currDayIndex]["totalPrice"] = totalHotelPriceForCurrDay;
      // let totalPackCalc = state.totalDayPrices.reduce((acc, p) => {
      //   return acc + Number(p?.totalPrice || 0);
      // }, 0)
      // state.finalPackPrice = totalPackCalc;
    },
    setHotelPriceForCurrDay: (state, action) => {
      let { totalHotelPriceForCurrDay = null, selectedHotelCurrDay = [], copyDetailsToDays = {} } = action.payload;
      let currDayPrice = state.totalDayPrices[state.currDayIndex] || {};
      currDayPrice["totalPrice"] = totalHotelPriceForCurrDay;
      console.log("setHotelPriceForCurrDay", totalHotelPriceForCurrDay, copyDetailsToDays && !isEmptyObject(copyDetailsToDays), copyDetailsToDays);
      if (copyDetailsToDays && !isEmptyObject(copyDetailsToDays)) {
        Object.keys(copyDetailsToDays).forEach(dayNo => {
          // if(dayNo <= 0) continue;
          let copyDayPrice = state.totalDayPrices[Number(dayNo) - 1] || {};
          copyDayPrice["totalPrice"] = totalHotelPriceForCurrDay;
          console.log("save day daya copy", dayNo, copyDayPrice);

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
      if(state.currDayIndex < state.totalDayPrices.length - 1) state["currDayIndex"] = Number(state.currDayIndex) + 1;
    },
    setMealPlanFor1Room: (state, action) => {
      let { hotelIndex = null, roomIndex = null, mealPlan = null } = action.payload;
      const currDayHotels = state.selectedHotels[state.currDayIndex]?.hotels;
      const currentHotelRooms = currDayHotels[hotelIndex]["selectedRooms"];
      let { roomName = '', selectedOccupancy = {}} = { ...currentHotelRooms[roomIndex] };
      const currentHotelRates = currDayHotels[hotelIndex]["roomRates"] || {};
      const currRoomRates = {...currentHotelRates[roomName]} || {};
      const isRoomRateAvailable = Boolean(currRoomRates)
      // let { roomName = '' } = currentRoom;
      let { occupancy: roomMaxOcc = {}, stdRoomPrice = {}, extraRates = {} } = currRoomRates;
      let { adults, child, childAges = []} = selectedOccupancy;
      let currRoomPrice = 0, 
        totalExtraAdults = Number(selectedOccupancy.adults) - Number(roomMaxOcc.adult);
      if(totalExtraAdults < 0) totalExtraAdults = 0;
      let totalAdultPrice = Number(currRoomRates[itiRoomPriceFieldsMap[mealPlan]]) + ( Number(currRoomRates[itiRoomPriceFieldsMap["extraAdultPrices"][mealPlan]]) * Number(totalExtraAdults) );
      let totalChildPrice = [...childAges].reduce((acc, ch) => {
        console.log("calculate child price 1", ch.age, currRoomRates?.minChildAgeForExtra, [...childAges][0], ch, ch.extraBed, mealPlan, itiRoomPriceFieldsMap[`extraChildBed-${ch.extraBed}`][mealPlan] )
        if(ch.age >= currRoomRates?.minChildAgeForExtra) 
          return  acc + Number( currRoomRates[ itiRoomPriceFieldsMap[`extraChildBed-${ch.extraBed.toString()}`][mealPlan] ] );
        else return acc + 0;
      }, 0)
      
      // Number(currRoomRates[itiRoomPriceFieldsMap[mealPlan]]) + ( Number(currRoomRates[itiRoomPriceFieldsMap["extraAdultPrices"][mealPlan]]) * Number(totalExtraAdults) );
      console.log("calculate child price", totalChildPrice, totalAdultPrice, currRoomRates[itiRoomPriceFieldsMap[mealPlan]], currRoomRates[itiRoomPriceFieldsMap["extraAdultPrices"][mealPlan]], totalExtraAdults, selectedOccupancy.adults, roomMaxOcc.adult, currRoomRates[ itiRoomPriceFieldsMap[`extraChildBed-false`][mealPlan] ])
      console.log("calculate room price ", roomName, currRoomRates, roomMaxOcc.adult, mealPlan, itiRoomPriceFieldsMap, itiRoomPriceFieldsMap[mealPlan], currRoomRates[itiRoomPriceFieldsMap[mealPlan]], selectedOccupancy.adults, totalExtraAdults, itiRoomPriceFieldsMap["extraAdultPrices"][mealPlan], currRoomRates[itiRoomPriceFieldsMap["extraAdultPrices"][mealPlan]], totalAdultPrice);
    

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
    },
    setTotalPackagePrice: (state, action) => {
      let { totalPackPrice = '' } = action?.payload;
      console.log("finalPackPrice", totalPackPrice, isNaN(totalPackPrice));
      if(isNaN(totalPackPrice)) return;
      state["finalPackPrice"] = totalPackPrice;
    },
    handleRemoveItiItem: (state, action) => {
      let { itiTextIndex = null } = action.payload;
      console.log("handleRemoveItiItem", itiTextIndex);
      if(isNaN(itiTextIndex)) return;
      // const currDayHotels = state.selectedHotels[state.currDayIndex]?.hotels;
      const currDayItiData = state.itineraryDesc[state.currDayIndex]["text"];
      if(itiTextIndex >= currDayItiData.length) return;
      // let newData = [ ...currDayItiData ];
      // newData.splice(itiTextIndex, 1);
      currDayItiData.splice(itiTextIndex, 1);
      console.log("handleRemoveItiItem final", currDayItiData.length);
    },
    setTotalTransferPrice: (state, action) => {
      let { transferPrice = 0 } = action?.payload;
      console.log('set total transfer price slice ', transferPrice);
      if(isNaN(transferPrice)) return;
      state["finalTransferPrice"] = transferPrice;
      
      // let totalPackCalc = state.totalDayPrices.reduce((acc, p) => {
      //   return acc + Number(p?.totalPrice || 0);
      // }, 0);
      // console.log('trasfer change ', transferPrice, totalPackCalc, Number(transferPrice) + Number(totalPackCalc))
      // state.finalPackPrice = Number(transferPrice) + Number(totalPackCalc);
    },
    calcTotalPackagePrice: (state, action) => {
      // separate out logic to calc total Pack price. Hotels + Transfer
      let totalPackCalc = state.totalDayPrices.reduce((acc, p) => {
        return acc + Number(p?.totalPrice || 0);
      }, 0);
      state.finalPackPrice = Number(state["finalTransferPrice"]) + Number(totalPackCalc);
    },
    setProfileData: (state, action) => {
      console.log("setProfileData ", action?.payload);
      let newData = action?.payload;
      let currData = { ...(state["userProfileData"] || {}) }
      state["userProfileData"] = { ...currData, ...newData};
    },
    selectTemplate: (state, action) => {
      let userData = state?.userData;
      console.log('selectTemplate ', userData, action?.payload);
      userData["templateName"] = action?.payload?.name || DEFAULT_TEMPLATE_NAME
    },
    handleRemovePolicyItem: (state, action) => {
      let { policyType = null, deleteIndex = null } = action?.payload;
      console.log("policy edit remove ", policyType, deleteIndex)
      if(!policyType || isNaN(deleteIndex)) return;
      let newProfileData = state?.userProfileData || {};
      let currArr = newProfileData[policyType] || [];
      if(deleteIndex > currArr.length) return;
      let newArr = [ ...currArr ];
      if(newArr.length > 0) newArr.splice(deleteIndex, 1);
      console.log("handleRemovepolicy text final", newArr, currArr);
      newProfileData[policyType] = newArr;
    },
    handleAddPolicyItem: (state, action) => {
      let { policyType = null } = action?.payload;
      console.log("policy edit remove ", policyType)
      if(!policyType ) return;
      let newProfileData = state?.userProfileData || {};
      let currArr = newProfileData[policyType] || null;
      if(!currArr) currArr = [{ "text": "" }];
      let newArr = [ ...currArr ];
      newArr.push({text: ""});
      console.log("handleRemovepolicy text final", newArr, currArr);
      newProfileData[policyType] = newArr;
    },
    updatePolicyText: (state, action) => {
      let { policyType = null, val = '', textIndex = null } = action.payload;
      console.log("policy edit ", policyType, val, textIndex, state?.userProfileData?.cancellationData.length)
      if(!policyType || isNaN(textIndex)) return;
      let newProfileData = state?.userProfileData || {};
      let currArr = newProfileData[policyType] || [];
      let newArr = [ ...currArr ];
      newArr[textIndex] = {"text": val};
      console.log("policy edit 2 ", policyType, val, textIndex, newArr.length, newArr[textIndex], currArr.length);
      newProfileData[policyType] = newArr;
    },
    setArrFlightsData: (state, action) => {
      if(!action?.payload) return;
      let { flightType = '', flightText = '' } = action?.payload;
      if(!flightType || !flightText) return;
      let flightsData = state["itiFlightsData"] || {};
      let newData = {...flightsData};
      newData[flightType] = flightText;
      state["itiFlightsData"] = newData;
    },
    setAboutDest: (state, action) => {
      if(!action?.payload) return;
      state["aboutDestText"] = action?.payload;
    },
    addDayItiText: (state, action) => {
      let itiData = state?.itineraryDesc || {};
      let currArr = itiData[state?.currDayIndex]?.text || null;
      if(!currArr) currArr = [""];
      let newArr = [ ...currArr ];
      newArr.push("");
      console.log("addDayItiText text final", newArr, currArr);
      itiData[state?.currDayIndex].text = newArr;
      // state?.itineraryDesc = newArr;
    },
    setFirebaseIdToken: (state, action) => {
      let signedInToken = action?.payload;
      console.log("set fbIdToken", signedInToken);
      state["fbIdToken"] = signedInToken;
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
  calculatePriceFor1Day,
  setHotelPriceForCurrDay,
  setMealPlanFor1Room,
  setReqsHistory,
  setPriceFor1Room,
  setItineraryDesc,
  updateItineraryDesc,
  setHotelLocation,
  setTotalPackagePrice,
  handleRemoveItiItem,
  setTotalTransferPrice,
  setProfileData,
  setUserData,
  selectTemplate,
  handleRemovePolicyItem,
  handleAddPolicyItem,
  updatePolicyText,
  setArrFlightsData,
  setAboutDest,
  addDayItiText,
  setFirebaseIdToken
} = todoSlice.actions;

// this is for configureStore
export default todoSlice.reducer;