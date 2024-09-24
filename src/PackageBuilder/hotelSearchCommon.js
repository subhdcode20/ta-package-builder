import React, {useEffect} from "react";
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

const FreeSoloCreateOption = ({selectedHotel = null, onChange, userHotelRates = []}) => {
  const [value, setValue] = React.useState(selectedHotel || null);
  const [hotelsDropdownList, setHotelsDropdownList] = React.useState(userHotelRates || []);

  useEffect(() => {
    if(userHotelRates && userHotelRates.length > 0) setHotelsDropdownList(userHotelRates);
  }, [userHotelRates])

  useEffect(() => {
    if(value !== null) onChange(value);
  }, [value])

  console.log("hotel drop down ", value, selectedHotel, hotelsDropdownList, userHotelRates);
  return (
    <Autocomplete
      fullWidth
      size="small"
      value={value || null}
      onChange={(event, newValue) => {
        console.log("maindest onChange ", newValue, typeof newValue);
        // if (newValue && newValue.hotelName) {
        //   // Create a new value from the user input
        //   setValue(newValue.hotelName);
        //   // setValue({
        //   //   title: newValue.inputValue,
        //   // });
        // } else {
        //   setValue(newValue);
        // }

         // If `newValue` is a custom input, set the value accordingly
         if (typeof newValue === 'string') {
          setValue({ hotelName: newValue });
        } else if (newValue && newValue.inputValue) {
          setValue({ hotelName: newValue.inputValue });
        } else {
          setValue(newValue);
        }

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
        if (typeof option === "string") {
          return option;
        }
        if (option.label) {
          return option.label;
        }
        return option.hotelName || "";
      }}
      renderOption={(props, option) => {
        console.log("maindest renderOption ", props, option);
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.label ? option.label : option.hotelName}
          </li>
        );
      }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params}  placeholder={ selectedHotel?.hotelName || "Seach any hotel.. "} />
      )}
    />
  );
}

export default FreeSoloCreateOption;