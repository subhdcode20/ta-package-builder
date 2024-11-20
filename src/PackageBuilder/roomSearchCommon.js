import React, {useEffect} from "react";
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

const FreeSoloCreateOption = ({selectedRoom = null, onChange, userRoomRates = []}) => {
  const [defaultValue, setDefaultValue] = React.useState(selectedRoom || null);
  const [value, setValue] = React.useState('');
  const [roomsDropdownList, setHotelsDropdownList] = React.useState(userRoomRates || []);
  console.log("room search rnder ", selectedRoom)

  useEffect(() => {
    if(userRoomRates && userRoomRates.length > 0) setHotelsDropdownList(userRoomRates);
  }, [userRoomRates])

  // useEffect(() => {
  //   if(value !== null) onChange(value);
  // }, [value])

  useEffect(() => {
    setDefaultValue(selectedRoom);
  }, [selectedRoom])

  console.log("room drop down Room", defaultValue ); //defaultValue, value, selectedRoom, roomsDropdownList, userRoomRates
  return (
    <Autocomplete
      fullWidth
      size="small"
      value={defaultValue || value || null}
      onChange={(event, newValue) => {
        console.log("main room onChange ", newValue, typeof newValue);
        if (newValue && newValue.roomName) {
          // Create a new value from the user input
          setValue(newValue); //.roomName
          if(newValue !== null) onChange(newValue);
          // setValue({
          //   title: newValue.inputValue,
          // });
        } else {
          setValue(newValue);
          if(newValue !== null) onChange(newValue);
        }

        setValue(newValue);
        if(newValue !== null) onChange(newValue);
      }}
      filterOptions={(options, params) => {
        console.log("main room filterOptions ", options, params, filter(options, params))
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
        console.log("main room getOptionLabel ", option, typeof option);
        // Add "xxx" option created dynamically
        if (option.label) {
          return option.label;
        }
        // Regular option
        return option.roomName;
      }}
      renderOption={(props, option) => {
        console.log("main room renderOption ", props, option);
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.label ? option.label : option.roomName}
          </li>
        );
      }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} placeholder={"Enter room type.. "} />
      )}
    />
  );
}

export default FreeSoloCreateOption;