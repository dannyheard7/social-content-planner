import React, { useContext } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import AppBar from "./Components/AppBar/AppBar";
import {
  AuthenticationContextProvider,
  AuthenticationContext
} from "./Components/Authentication/AuthenticationContextProvider";
import Login from "./Components/Login/Login";
import styles from "./App.styles";
import { makeStyles } from "@material-ui/core";
import LoginCallback from "./Components/Login/LoginCallback";
import Dashboard from "./Components/Dashboard/Dashboard";

const useStyles = makeStyles(styles);

const Routes: React.FC = () => {
  const { isAuthenticated } = useContext(AuthenticationContext);

  if (isAuthenticated) {
    return (
      <Switch>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route>
          <Redirect to="/dashboard" />
        </Route>
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/login-callback">
          <LoginCallback />
        </Route>
        <Route>
          <Redirect to="/login" />
        </Route>
      </Switch>
    );
  }
};

const Layout: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <AppBar />
      <div className={classes.toolbar} />
      {children}
    </React.Fragment>
  );
};

function App() {
  return (
    <AuthenticationContextProvider
      domain={process.env.REACT_APP_AUTH0_DOMAIN!}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
      redirectUri={`${window.location.protocol}//${process.env.REACT_APP_CLIENT_ADDRESS}/login-callback`}
    >
      <Layout>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </Layout>
    </AuthenticationContextProvider>
  );
}

export default App;
