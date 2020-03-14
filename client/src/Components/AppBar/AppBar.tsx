import {
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  AppBar,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { AccountCircle, Menu as MenuIcon } from "@material-ui/icons";
import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";

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
  const [auth] = useState(true);
  const [anchorEl] = useState(null);
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
          {auth && (
            <Fragment>
              <Drawer open={drawerOpen} onClose={() => { setDrawerOpen(false) }}>
                <List>
                  <ListItem button>
                    <Link to="/platforms" onClick={() => { setDrawerOpen(false) }}>
                      <ListItemText>Platforms</ListItemText>
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
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={userMenuOpen}
                onClose={() => setUserMenuOpen(false)}
              >
                <MenuItem onClick={() => setUserMenuOpen(false)}>Profile</MenuItem>
                <MenuItem onClick={() => setUserMenuOpen(false)}>
                  My account
                </MenuItem>
              </Menu>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default AppMenu;
