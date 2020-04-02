import { ApolloProvider } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import React, { useContext } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Analytics from 'react-router-ga';
import styles from "./App.styles";
import AppState from "./Common/Interfaces/AppState";
import AppBar from "./Components/AppBar/AppBar";
import { AppContextProvider } from "./Components/AppContext/AppContextProvider";
import { AuthenticationContext, AuthenticationContextProvider } from "./Components/Authentication/AuthenticationContextProvider";
import CreatePost from "./Components/CreatePost/CreatePost";
import Dashboard from "./Components/Dashboard/Dashboard";
import Loading from "./Components/Loading/Loading";
import Login from "./Components/Login/Login";
import LoginCallback from "./Components/Login/LoginCallback";
import PlatformConnections from "./Components/PlatformConnection/PlatformConnections";
import Post from "./Components/Post/Post";
import PostList from "./Components/PostList/PostList";
import config from './config';

const useStyles = makeStyles(styles);

const Routes: React.FC = () => {
  const { isAuthenticated, token, loading } = useContext(AuthenticationContext);

  if (loading) return <Loading />

  if (isAuthenticated) {
    const httpLink = createHttpLink({
      uri: config.GRAPHQL_HOST
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
          <Route exact path="/posts">
            <PostList />
          </Route>
          <Route exact path="/posts/:id">
            <Post />
          </Route>
          <Route exact path="/platforms">
            <PlatformConnections />
          </Route>
          <Route exact path="/post/new">
            <CreatePost />
          </Route>
          <Route>
            <Redirect to="/posts" />
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
      <div className={classes.main}>
        {children}
      </div>
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
        domain={config.AUTH0_DOMAIN}
        clientId={config.AUTH0_CLIENT_ID!}
        redirectUri={`${window.location.protocol}//${config.CLIENT_ADDRESS}/login-callback`}
        onRedirectCallback={onRedirectCallback}
      >
        <BrowserRouter>
          <Analytics id={config.GA_TRACKING_ID}>
            <Layout>
              <Routes />
            </Layout>
          </Analytics>
        </BrowserRouter>
      </AuthenticationContextProvider>
    </AppContextProvider>
  );
}

export default App;
