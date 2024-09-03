import React, {useEffect} from "react";
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

const FreeSoloCreateOption = ({selectedRoom = null, onChange, userRoomRates = []}) => {
  const [value, setValue] = React.useState(selectedRoom || null);
  const [roomsDropdownList, setHotelsDropdownList] = React.useState(userRoomRates || []);

  useEffect(() => {
    if(userRoomRates && userRoomRates.length > 0) setHotelsDropdownList(userRoomRates);
  }, [userRoomRates])

  useEffect(() => {
    if(value !== null) onChange(value);
  }, [value])

  console.log("hotel drop down ", value, selectedRoom, roomsDropdownList, userRoomRates);
  return (
    <Autocomplete
      fullWidth
      size="small"
      value={value || null}
      onChange={(event, newValue) => {
        console.log("maindest onChange ", newValue, typeof newValue);
        if (newValue && newValue.roomName) {
          // Create a new value from the user input
          setValue(newValue.roomName);
          // setValue({
          //   title: newValue.inputValue,
          // });
        } else {
          setValue(newValue);
        }

        setValue(newValue);
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
            label: inputValue  //`Enter price manually for "${inputValue}"`,
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
        return option.roomName;
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
        <TextField {...params} placeholder="Seach room types.. " />
      )}
    />
  );
}

export default FreeSoloCreateOption;