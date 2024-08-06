import { createSlice } from '@reduxjs/toolkit';

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
    currDayIndex: 0,
    daysArr: [],
    selectedHotels: [], // [ [day 1 hotels], [day 2 hotels].. ]
    selectedRooms: []  // [ [ [day 1 hotel 1 room 1] , [day 1 hotel 2 room 1] ], .. ]
  },
  reducers: {
    onCurrDayIndexChange: (state, action) => {
      state.currDayIndex = action.payload;
    },
    createEmptyPackageDataDayWise: (state, action) => {
      let newDaysArr = [], newHotelsArr = [];
      for(let ii = 0; ii < action.payload.noOfNights+1; ii++) {
        newDaysArr.push({
          key: `Day ${ii}`
        });
        newHotelsArr.push(null);
      }
      state.daysArr = newDaysArr;
      state.selectedHotels = [ ...newDaysArr.map((i, iIndex) => [{ key: `D-${iIndex + 1}_H-${1}` }] ) ];
      // state.selectedRooms = [ ...state.selectedHotels.map((i, iIndex) => i.map(ii => [{ key: `D-${iIndex + 1}_H-${iIndex + 1}_R-${1}` }] ) ) ];
      console.log("create initial data", action.payload, newDaysArr, newHotelsArr, state.selectedHotels, state.selectedRooms);
    },
    handleHotelSelect: (state, action) => {
      let { hotelIndex = null, data = null } = action.payload;
      const currHotelData = state.selectedHotels[state.currDayIndex][hotelIndex];
      console.log("hotel select slice 1", state, state.currDayIndex, state.selectedHotels, hotelIndex, data)
      state.selectedHotels[state.currDayIndex][hotelIndex] = {
        ...data, 
        key: currHotelData?.key,
        "selectedRooms": [{ key: `Da` }]
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
    }
  }
});

// this is for dispatch
export const { 
  onCurrDayIndexChange, 
  createEmptyPackageDataDayWise, 
  handleHotelSelect,
  addNewRoomToHotel
} = todoSlice.actions;

// this is for configureStore
export default todoSlice.reducer;