import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import { setCurrDayActivity } from "./packBuilderSlice.js";
import { getActivitiesListForLoc } from "../geminiUtils/index.js";
const filter = createFilterOptions();

const AddActivities = ({ onChange = () => {} }) => {
	const currentDayIndex = useSelector((state) => state.packBuilderData.currDayIndex);
	const selectedHotels = useSelector((state) => state.packBuilderData.selectedHotels);
    const activitesData = useSelector((state) => state.packBuilderData.activities);
	const currDayHotels = selectedHotels[currentDayIndex]?.hotels || [];
	const daysArr = useSelector((state) => state.packBuilderData.daysArr) || [];
	const reqData = useSelector((state) => state.packBuilderData.reqData) || {};
	const userData = useSelector((state) => state.packBuilderData.userData) || {};
    const [defaultValue, setDefaultValue] = useState([]);
    const [value, setValue] = useState(activitesData[`${currentDayIndex}`] || []);
    const [dropdownList, setDropdownList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDropdown, setOpenDropdown] = React.useState(false);
    const dispatch = useDispatch();
    let currLoc = currDayHotels[0]?.location || null;
    const lastLoc = useRef(null);
    console.log("activity search rnder ", selectedHotels);

  //get activities suggestion.
  const getCurrDayActivity = useCallback(async () => {
    setOpenDropdown(true);
    let currDayHotels = selectedHotels[currentDayIndex]?.hotels || [];
    // let currLoc = currDayHotels[0]?.location || null;
    let startingFrom = currentDayIndex == 0 ? reqData?.pickUp : currDayHotels[currentDayIndex - 1]?.location || null;
    console.log("activity data for prompt --", currentDayIndex, reqData?.destination, currLoc, lastLoc.current, startingFrom);
    if(!currLoc) return;
    if(lastLoc.current == currLoc) return;
    setLoading(true);
    let activityListCurrDay = await getActivitiesListForLoc({
        destination: reqData?.destination, 
        location: currLoc,
        startingFrom 
    });
    lastLoc.current = currLoc;
    console.log("activity data result ",currentDayIndex, activityListCurrDay, reqData?.destination, currLoc, startingFrom);
    setDropdownList(activityListCurrDay?.activities || []);
    setLoading(false);
    // dispatch(setCurrDayActivity({ activityList: activityListCurrDay }));
  }, [reqData?.destination, currLoc])

  const handleClose = () => {
    console.log("handle close: ")
    setOpenDropdown(false);
    // setDropdownList([]);
  };

//   useEffect(() => {
//     getCurrDayActivity();
//   }, [reqData?.destination, currLoc])

  const selectActivity = (data = []) => {
    if(data) dispatch(setCurrDayActivity({ activityList: data }));
  }

//   return null;
//   useEffect(() => {
//     setDefaultValue(selectedRoom);
//   }, [selectedRoom])

  console.log("activity drop down render", dropdownList, defaultValue, value ); //defaultValue, value, selectedRoom, roomsDropdownList, userRoomRates
  return (<Grid item xs={12}>
    <Box display={"flex"} flexDirection={'row'}>
        <InputLabel id={`room_H-${currentDayIndex + 1}`} sx={{fontSize: 12, my: 'auto'}}>
            &nbsp;&nbsp;{`Select Activities for Day ${currentDayIndex + 1}`} 
        </InputLabel>
    </Box>
    <Autocomplete 
      multiple
      open={openDropdown}
      onOpen={getCurrDayActivity}
      onBlur={() => setOpenDropdown(false)}
      loading={loading}
      onClose={() => handleClose()}
      disableCloseOnSelect
      fullWidth
      size="small"
      filterSelectedOptions
      value={value || null}
      onChange={(event, newValue) => {
        console.log("main activity onChange ", newValue, typeof newValue);
        // if (newValue && newValue.name) {
        //   // Create a new value from the user input
        //   setValue(newValue); //.roomName
        //   if(newValue !== null) onChange(newValue);
        //   // setValue({
        //   //   title: newValue.inputValue,
        //   // });
        // } else {
        //   setValue(newValue);
        //   if(newValue !== null) onChange(newValue);
        // }

        setValue(newValue);
        if(newValue !== null) selectActivity(newValue);
      }}
      filterOptions={(options, params) => {
        console.log("main activity filterOptions ", options, params)
        console.log("main activity filterOptions 222 -- ", filter(options, params));
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.name);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            name: inputValue,
            label: inputValue
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={dropdownList}
      getOptionLabel={(option) => {
        console.log("main activity getOptionLabel ", option, typeof option);
        // Add "xxx" option created dynamically
        if (option.label) {
          return option.label;
        }
        // Regular option
        return option.name;
      }}
      renderOption={(props, option) => {
        console.log("main activity renderOption ", props, option);
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.label ? option.label : option.name}
          </li>
        );
      }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} placeholder={`Select activities for Day ${currentDayIndex + 1}.. `} 
        slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
  </Grid>);
}

export default AddActivities;