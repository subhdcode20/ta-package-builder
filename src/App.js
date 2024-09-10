import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";
import { store } from './appStore/store.js';
import { Provider } from 'react-redux'

import './App.css';
import Routes from './Routes.js';

const theme = createTheme({
  palette: {
    primary: {
      main: "#b352d1", //'#428bfe'
    },
    secondary: {
      main: "#000000bf",
    },  
    text: {
      primary: "#212121", //'#212121',  //'#7c3647',  //'rgba(124, 54, 71, 1)',
      secondary: "#000000", //'#384E89',  //'#FBAD23',  //'#ffffff',   //'rgba(255, 255, 255, 1)',
      paragraph: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.54)",
      highlight:'#d152c8'
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    navlink: {
      color: "#000000bf",
    },
    bold: {
      fontWeight: 600,
    },
  },
  background:{
    primary:"#ffffff",
    secondary: "#212121",
  }
});
const themeWithResponsiveFont = responsiveFontSizes(theme);

const App = () => {
  return (
    <ThemeProvider theme={themeWithResponsiveFont}>
      <Provider store={store}>
        <Routes />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
