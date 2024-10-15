import React, {useEffect} from "react";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import { DestinationNames } from "../Constants.js";

const filter = createFilterOptions();

const FreeSoloCreateOption = ({destination = null, handleDestSelect}) => {
  const [value, setValue] = React.useState(destination || null);

  useEffect(() => {
    if(value !== null) handleDestSelect({ "target": { "value": value } });
  }, [value])

  return (<>
    <InputLabel id="dest" sx={{fontSize: 12}}>Select Destination*</InputLabel>
    <Autocomplete
      fullWidth
      size="small"
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
            label: `Find B2B cab quotes for "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-dest"
      options={DestinationNames}
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
        return option.label;
      }}
      renderOption={(props, option) => {
        console.log("maindest renderOption ", props, option);
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {typeof option === 'string' ? option : option.label}
          </li>
        );
      }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} sx={{fontSize: 12, m: 0, padding: 0}} placeholder={destination || ''}/>
      )}
    />
  </>);
}

export default FreeSoloCreateOption;