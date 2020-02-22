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
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import AppState from "./Common/AppState";
import CreatePost from "./Components/CreatePost/CreatePost";
import { AppContextProvider } from "./Components/AppContext/AppContextProvider";

const useStyles = makeStyles(styles);

const Routes: React.FC = () => {
  const { isAuthenticated, token } = useContext(AuthenticationContext);

  if (isAuthenticated) {
    const httpLink = createHttpLink({
      uri: process.env.REACT_APP_GRAPHQL_HOST!,

    });

    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : ""
        }
      };
    });

    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });

    return (
      <ApolloProvider client={client}>
        <Switch>
          <Route exact path="/dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/post/new">
            <CreatePost />
          </Route>
          <Route>
            <Redirect to="/post/new" />
          </Route>
        </Switch>
      </ApolloProvider>
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

const onRedirectCallback = (appState: AppState) => {
  if (appState && appState.targetUrl)
    window.location.pathname = appState.targetUrl;
};

function App() {
  return (
    <AppContextProvider>
      <AuthenticationContextProvider
        domain={process.env.REACT_APP_AUTH0_DOMAIN!}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
        redirectUri={`${window.location.protocol}//${process.env.REACT_APP_CLIENT_ADDRESS}/login-callback`}
        onRedirectCallback={onRedirectCallback}
      >
        <Layout>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </Layout>
      </AuthenticationContextProvider>
    </AppContextProvider>
  );
}

export default App;
