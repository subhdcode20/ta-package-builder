import React, {useEffect} from "react";
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

// import { HotelNames } from "../Constants.js";
const HotelNames = [];
const filter = createFilterOptions();

const FreeSoloCreateOption = ({selectedHotel = null, handleHotelSelect}) => {
  const [value, setValue] = React.useState(selectedHotel || null);

  useEffect(() => {
    if(value !== null) handleHotelSelect({ "target": { "value": value } });
  }, [value])

  return (
    <Autocomplete
      fullWidth
      value={value}
      onChange={(event, newValue) => {
        console.log("maindest onChange ", newValue, typeof newValue);
        if (typeof newValue === 'string') {
          setValue(newValue); 
          // setValue({
          //   title: newValue,
          // });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue(newValue.inputValue);
          // setValue({
          //   title: newValue.inputValue,
          // });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        console.log("maindest filterOptions ", options, params, filter(options, params))
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.title);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            label: `Enter price manually for "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={HotelNames}
      getOptionLabel={(option) => {
        console.log("maindest getOptionLabel ", option, typeof option);
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.hotelName;
      }}
      renderOption={(props, option) => {
        console.log("maindest renderOption ", props, option);
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {typeof option === 'string' ? option : option.hotelName}
          </li>
        );
      }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label="Seach any hotel.. " />
      )}
    />
  );
}

export default FreeSoloCreateOption;