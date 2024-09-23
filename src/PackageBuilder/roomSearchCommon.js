import React, { useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

const FreeSoloCreateOption = ({ selectedRoom = null, onChange, userRoomRates = [] }) => {
  const [value, setValue] = React.useState(selectedRoom || null);
  const [roomsDropdownList, setHotelsDropdownList] = React.useState(userRoomRates || []);

  useEffect(() => {
    if (userRoomRates && userRoomRates.length > 0) setHotelsDropdownList(userRoomRates);
  }, [userRoomRates])

  useEffect(() => {
    if (value !== null) onChange(value);
  }, [value])

  // useEffect(() => {
  //   if (selectedRoom ) {
  //     setValue(selectedRoom);
  //   }
  // }, [selectedRoom]);
  console.log("roomSearch drop down ", value, selectedRoom, roomsDropdownList, userRoomRates);
  return (
    <Autocomplete
      fullWidth
      size="small"
      value={value || selectedRoom || ""}
      onChange={(event, newValue) => {
        console.log("maindest onChange ", newValue, typeof newValue);
        // if (newValue && newValue.roomName) {
        //   // Create a new value from the user input
        //   setValue(newValue.roomName);
        //   // setValue({
        //   //   title: newValue.inputValue,
        //   // });
        // } else {
        //   setValue(newValue);
        // }
        if (typeof newValue === 'string') {
          // If newValue is a string (for manually entered text)
          setValue(newValue);
        } else if (newValue && newValue.roomName) {
          // If newValue is an object with roomName property
          setValue(newValue.roomName);
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        console.log("maindest filterOptions ", options, params, filter(options, params))
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.roomName);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            roomName: inputValue,
            label: inputValue  //Enter price manually for "${inputValue}",
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={roomsDropdownList}
      getOptionLabel={(option) => {
        console.log("maindest getOptionLabel ", option, typeof option);
        // Add "xxx" option created dynamically
        if (option.label) {
          return option.label;
        }
        // Regular option
        if (typeof option === 'string') {
          return option; // Handle if option is a string
        }
        if (option.roomName) {
          return option.roomName; // Handle if option is an object
        }
        return ''; // Fallback in case the option is neither

      }}
      renderOption={(props, option) => {
        console.log("maindest renderOption ", props, option);
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.label ? option.label : option.roomName}
          </li>
        );
      }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} placeholder={value || "Enter Data..."} />
      )}
    />
  );
}

export default FreeSoloCreateOption;