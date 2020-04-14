import { AppBar, Drawer, IconButton, List, ListItem, ListItemText, makeStyles, Menu, MenuItem, Toolbar, Typography, useTheme, Divider, Link } from "@material-ui/core";
import { AccountCircle, Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "@material-ui/icons";
import React, { Fragment, useContext, useState, useRef } from "react";
import classNames from 'classnames';
import { AuthenticationContext } from "../Authentication/AuthenticationContextProvider";
import config from '../../config';
import styles from './AppBar.styles';
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles(styles);

const AppMenu: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { isAuthenticated, loginWithRedirect, logout } = useContext(AuthenticationContext);
  const anchorEl = useRef(null);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={classNames(classes.menuButton, drawerOpen && classes.hide)}
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Elevait
          </Typography>
          <Drawer
            className={classes.drawer}
            open={drawerOpen}
            onClose={() => { setDrawerOpen(false) }}
            variant="persistent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={() => { setDrawerOpen(false) }}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </div>
            <Divider />
            <List>
              {isAuthenticated && (
                <Fragment>
                  <Link to="/posts" component={RouterLink} onClick={() => { setDrawerOpen(false) }}>
                    <ListItem button>
                      <ListItemText>Posts</ListItemText>
                    </ListItem>
                  </Link>
                  <Link to="/post/new" component={RouterLink} onClick={() => { setDrawerOpen(false) }}>
                    <ListItem button>
                      <ListItemText>New Post</ListItemText>
                    </ListItem>
                  </Link>
                  <Link to="/platforms" component={RouterLink} onClick={() => { setDrawerOpen(false) }}>
                    <ListItem button>
                      <ListItemText>Platforms</ListItemText>
                    </ListItem>
                  </Link>
                  <Divider />
                </Fragment>
              )}
              <Link to="/feedback" component={RouterLink} onClick={() => { setDrawerOpen(false) }}>
                <ListItem button>
                  <ListItemText>Feedback</ListItemText>
                </ListItem>
              </Link>
              <Link to="/privacy-policy" component={RouterLink} onClick={() => { setDrawerOpen(false) }}>
                <ListItem button>
                  <ListItemText>Privacy Policy</ListItemText>
                </ListItem>
              </Link>
            </List>
          </Drawer>
          {isAuthenticated ? (
            <Fragment>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                color="inherit"
                ref={anchorEl}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl.current}
                open={userMenuOpen}
                onClose={() => setUserMenuOpen(false)}
              >
                <MenuItem onClick={() => {
                  logout({
                    client_id: config.AUTH0_CLIENT_ID!,
                    returnTo: `${window.location.protocol}//${config.CLIENT_ADDRESS}/login`
                  }); setUserMenuOpen(false);
                }}>Logout</MenuItem>
              </Menu>
            </Fragment>
          ) :
            <div style={{ marginLeft: 'auto', cursor: 'pointer' }}>
              <ListItemText onClick={loginWithRedirect}>Login</ListItemText>
            </div>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default AppMenu;
