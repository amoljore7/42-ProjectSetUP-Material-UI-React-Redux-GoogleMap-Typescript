import React from 'react';
import { getCurrentUser, clearLocalStorage } from '../utils/local-storage';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Typography,
  Avatar,
  IconButton,
  MenuItem,
  Menu
} from '@material-ui/core';
import { deepOrange } from '@material-ui/core/colors';
import MoreIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme) => ({
  appBarStyle: {
    backgroundColor: 'white'
  },
  grow: {
    flexGrow: 1
  },
  tabFlexStyling: {
    height: '100%'
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500]
  },
  textFieldStyle: {
    width: '12rem',
    backgroundColor: 'grey',
    borderRadius: '0.4rem'
  },
  tabsStyle: {
    minHeight: '64px'
  },
  tabStyle: {
    [theme.breakpoints.up(600)]: {
      minWidth: '3rem',
      maxWidth: '5rem'
    },
    fontSize: '0.775rem',
    textTransform: 'none',
    color: '#707070'
  },
  selectedTabStyle: {
    color: '#000000'
  },
  title: {
    color: '#4491E0',
    fontWeight: 600,
    fontSize: '1.2rem'
  },
  toolbarStyle: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  menuPaperStyle: {
    top: '64px',
    right: '24px'
  },
  currentUser: {
    font: 'normal normal medium Futura',
    color: '#707070',
    marginRight: '5px'
  }
}));

const Navbar: React.FC = () => {
  let tabValue = 3;
  if (location.pathname === '/user/home') {
    tabValue = 0;
  } else if (location.pathname === '/user/dashboard') {
    tabValue = 1;
  } else if (location.pathname === '/user/patients') {
    tabValue = 2;
  } else if (location.pathname === '/user/resources') {
    tabValue = 3;
  } else if (location.pathname === '/user/analytics') {
    tabValue = 4;
  }

  const classes = useStyles();
  const [value, setValue] = React.useState(tabValue);
  const [anchorEl, setAnchorEl] = React.useState<(EventTarget & HTMLButtonElement) | null>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const currentUser = getCurrentUser();

  const handleChange = (event: React.ChangeEvent<Record<string, unknown>>, newValue: number) => {
    setValue(newValue);
  };

  const logout = () => {
    clearLocalStorage();
    window.location.href = '/login';
  };
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      style={{ marginTop: '37px' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}>
      <MenuItem
        onClick={() => {
          logout();
          handleMenuClose();
        }}>
        Log Out
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      style={{ marginTop: '30px' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}>
      <MenuItem
        onClick={() => {
          logout();
          handleMenuClose();
        }}>
        Log Out
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
    </Menu>
  );
  const logInUser = currentUser.split('@')[0];
  return (
    <div className={classes.grow}>
      <AppBar className={classes.appBarStyle} position="static">
        <Toolbar className={classes.toolbarStyle}>
          <Typography component="h1" variant="h5" className={classes.title}>
            TeleNavigation 2.0
          </Typography>
          <Tabs
            className={classes.tabsStyle}
            classes={{ flexContainer: classes.tabFlexStyling }}
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="disabled tabs example">
            <Tab
              className={classes.tabStyle}
              classes={{ selected: classes.selectedTabStyle }}
              label="Home"
              to="/user/home"
              component={NavLink}
            />
            <Tab
              className={classes.tabStyle}
              classes={{ selected: classes.selectedTabStyle }}
              label="Dashboard"
              to="/user/dashboard"
              component={NavLink}
            />
            <Tab
              className={classes.tabStyle}
              classes={{ selected: classes.selectedTabStyle }}
              label="Patients"
              to="/user/patients"
              component={NavLink}
            />
            <Tab
              className={classes.tabStyle}
              classes={{ selected: classes.selectedTabStyle }}
              label="Resources"
              to="/user/resources"
              component={NavLink}
            />
            <Tab
              className={classes.tabStyle}
              classes={{ selected: classes.selectedTabStyle }}
              label="Analytics"
              to="/user/analytics"
              component={NavLink}
            />
          </Tabs>
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="primary">
              <span className={classes.currentUser}> {logInUser}</span>
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            </IconButton>
          </div>

          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit">
              <MoreIcon className={classes.title} />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

export default Navbar;
