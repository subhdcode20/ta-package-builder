import React from 'react';

export const MainContext = React.createContext({});
export const DayWiseItineraryContext = React.createContext({});

export const isEmptyObject = (obj) => {
  for (let name in obj) {
    if (obj.hasOwnProperty(name)) {
      return false;
    }
  }
  return true;
};