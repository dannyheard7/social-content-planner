import { AppBar, Drawer, IconButton, List, ListItem, ListItemText, makeStyles, Menu, MenuItem, Toolbar, Typography } from "@material-ui/core";
import { AccountCircle, Menu as MenuIcon } from "@material-ui/icons";
import React, { Fragment, useContext, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthenticationContext } from "../Authentication/AuthenticationContextProvider";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: 1
  },
  title: {
    flexGrow: 1
  }
});

const AppMenu: React.FC = () => {
  const classes = useStyles();
  const { isAuthenticated, loginWithRedirect, logout } = useContext(AuthenticationContext);
  const anchorEl = useRef(null);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Smarketing
          </Typography>
          {isAuthenticated ? (
            <Fragment>
              <Drawer open={drawerOpen} onClose={() => { setDrawerOpen(false) }}>
                <List>
                  <ListItem button>
                    <Link to="/posts" onClick={() => { setDrawerOpen(false) }}>
                      <ListItemText>Posts</ListItemText>
                    </Link>
                  </ListItem>
                  <ListItem button>
                    <Link to="/platforms" onClick={() => { setDrawerOpen(false) }}>
                      <ListItemText>Platforms</ListItemText>
                    </Link>
                  </ListItem>
                  <ListItem button>
                    <Link to="/post/new" onClick={() => { setDrawerOpen(false) }}>
                      <ListItemText>New Post</ListItemText>
                    </Link>
                  </ListItem>
                </List>
              </Drawer>
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
                <MenuItem onClick={() => { logout({}); setUserMenuOpen(false); }}>Logout</MenuItem>
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
