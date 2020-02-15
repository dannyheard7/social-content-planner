import {
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  AppBar
} from "@material-ui/core";
import { AccountCircle, Menu as MenuIcon } from "@material-ui/icons";
import React, { useState } from "react";

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
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Photos
          </Typography>
          {auth && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => setMenuOpen(!menuOpen)}
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
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
              >
                <MenuItem onClick={() => setMenuOpen(false)}>Profile</MenuItem>
                <MenuItem onClick={() => setMenuOpen(false)}>
                  My account
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default AppMenu;
