import React from "react";

import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Toolbar from "@mui/material/Toolbar";
import Avatar from '@mui/material/Avatar';
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import Chip from "@mui/material/Chip";

const drawerWidth = 250;

const navItems = [""];

const pages = [
  {
    name: "Dashboard",
    link: "/home",
  },
  {
    name: "My Requests",
    link: "/my-reqs",
  },
  {
    name: "Upload Your Rates",
    link: "/upload-ratesheet",
  },
  {
    name: "Signup",
    link: "/signup"
  },
  {
    name: "Login",
    link: "/login",
  },
  // {
  //   name: "Request a Demo",
  //   link: "/request-demo"
  // }
];

const priorityPages = [
    {
        name: "Signup",
        link: "/signup"
    },
    {
        name: "Login",
        link: "/login",
    },
    // {
    //     name: "Request a Demo",
    //     link: "/request-demo"
    // },
    // {
    //     name: "Pricing",
    //     link: "/pricing"
    // }
]

function NavBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const userData = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = Boolean(userData);
  const navigate = useNavigate();

  let finalRoutes = pages;
  if (isLoggedIn)
    finalRoutes = [...pages];

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      {isLoggedIn && (
        <>
          <Box display="flex" flexDirection="row" sx={{ backgroundColor: "primary.main" }}>
            {<Avatar alt="logo" src={userData.logo} sx={{ margin: "auto 8px" }}/>}
          
            <Box sx={{ py: 2, px: 1, flexGrow: "1", textAlign: "left" }}>
              {`Hi, ${userData ? `${userData.name || ""}` : ""}`}
              <br />
            </Box>
          </Box>
          <Divider />
        </>
      )}
      <List>
        {finalRoutes.map((page, index) => (
          <ListItem
            className="fw-600"
            key={page.name}
            disablePadding
            onClick={() => navigate(page.link)}
          >
            <ListItemButton>
              <ListItemText className="fw-600" primary={page.name} />
              {
                page?.highlight && (<ListItemIcon>
                  <Chip label="New" color="primary"/>
                </ListItemIcon>)
              }
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="static" component="nav" sx={{ background: "#fff" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "block" } }}
          >
            <MenuIcon color="primary" />
          </IconButton>
          {/* <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "block", sm: "block" } }}
          >
          </Typography> */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
            <img src="/logo.jpg" style={{margin: 'auto', width: '150px'}} />
          </div>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {priorityPages.map((item) => (<Link to={item.link}>
              <Button key={item} sx={{ color: "#000" }}>
                {item.name}
              </Button>
            </Link>))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              // background: "#fefcec",
              fontWeight: 600,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

NavBar.propTypes = {
  window: PropTypes.func,
};

export default NavBar;
