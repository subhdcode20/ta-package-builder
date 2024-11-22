import React, { useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { set } from "date-fns";

const filter = createFilterOptions();

const FreeSoloCreateOption = ({ selectedHotel = null, onChange, userHotelRates = [] }) => {
  const [defaultValue, setDefaultValue] = React.useState(selectedHotel || null);
  const [value, setValue] = React.useState('');
  const [hotelsDropdownList, setHotelsDropdownList] = React.useState(userHotelRates || []);
  console.log("hotel search rnder ", selectedHotel)

  useEffect(() => {
    if (userHotelRates && userHotelRates.length > 0) setHotelsDropdownList(userHotelRates);
  }, [userHotelRates])

  // useEffect(() => {
  //   console.log('save day daya hotel search value change effect', value)
  //   if (value !== null) onChange(value);
  // }, [value])

  useEffect(() => {
    setDefaultValue(selectedHotel);
  }, [selectedHotel])

  console.log("hotel drop down ", defaultValue, value, selectedHotel, hotelsDropdownList, userHotelRates);
  return (
    <Autocomplete
      fullWidth
      size="small"
      value={defaultValue || value || null}
      onChange={(event, newValue) => {
        console.log("save day daya hotel search maindest onChange ", newValue, typeof newValue);
        if (newValue && newValue.hotelName) {
          // Create a new value from the user input
          setValue(newValue);
          if (newValue !== null) onChange(newValue);
          // setValue({
          //   title: newValue.inputValue,
          // });
        } else {
          setValue(newValue);
          if (newValue !== null) onChange(newValue);
        }

        // If `newValue` is a custom input, set the value accordingly
        //  if (typeof newValue === 'string') {
        //   setValue({ hotelName: newValue });
        // } else if (newValue && newValue.inputValue) {
        //   setValue({ hotelName: newValue.inputValue });
        // } else {
        //   setValue(newValue);
        // }

        // setValue(newValue);
      }}
      filterOptions={(options, params) => {
        console.log("maindest filterOptions ", options, params, filter(options, params))
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.hotelName);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            hotelName: inputValue,
            label: inputValue  //`Enter price manually for "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={hotelsDropdownList}
      getOptionLabel={(option) => {
        console.log("maindest getOptionLabel ", option, typeof option);
        // Add "xxx" option created dynamically
        // if (typeof option === "string") {
        //   return option;
        // }
        if (option.label) {
          return option.label;
        }
        return `${option.hotelName} ${option?.starCategory || ''}` 
      }}
      renderOption={(props, option) => {
        console.log("maindest renderOption ", props, option);
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.label ? option.label : `${option.hotelName} ${option?.starCategory ? ` - ${option?.starCategory}⭐` : ''}`}
          </li>
        );
      }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} placeholder="Seach any hotel.." />
      )}
    />
  );
}

export default FreeSoloCreateOption;