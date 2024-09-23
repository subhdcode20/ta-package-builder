import React, { useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

const FreeSoloCreateOption = ({ selectedHotel = null, onChange, userHotelRates = [] }) => {
  const [value, setValue] = React.useState(selectedHotel || null);
  const [hotelsDropdownList, setHotelsDropdownList] = React.useState(userHotelRates || []);

  useEffect(() => {
    if (userHotelRates && userHotelRates.length > 0) setHotelsDropdownList(userHotelRates);
  }, [userHotelRates]);

  useEffect(() => {
    if (value !== null) onChange(value); // Call onChange with the complete hotel object
  }, [value]);

  useEffect(() => {
    if (selectedHotel && selectedHotel.hotelName) {
      setValue(selectedHotel.hotelName);
    }
  }, [selectedHotel]);

  console.log("hotel drop down ", value, selectedHotel, hotelsDropdownList, userHotelRates);

  return (
    <Autocomplete
      fullWidth
      size="small"
      value={value || ''}
      onChange={(event, newValue) => {
        if (newValue && typeof newValue === 'object' && newValue.hotelName) {
          setValue(newValue.hotelName); // Store the hotelName as a string
        } else if (typeof newValue === 'string') {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;

        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.hotelName);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            hotelName: inputValue,
            label: inputValue,
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
        if (typeof option === 'string') {
          return option;
        }
        if (option && option.hotelName) {
          return option.hotelName;
        }
        return '';
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.label ? option.label : option.hotelName}
          </li>
        );
      }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} value={value || ""} placeholder="Enter hotel..." />
      )}
    />
  );
}

export default FreeSoloCreateOption;
