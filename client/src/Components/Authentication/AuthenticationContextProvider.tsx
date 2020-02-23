import createAuth0Client from "@auth0/auth0-spa-js";
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client";
import React, { useState, useEffect } from "react";
import AppState from "../../Common/Interfaces/AppState";

interface IAuthenticationContext {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  loading: boolean;
  loginWithRedirect: (p: RedirectLoginOptions) => Promise<void>;
  loginWithPopup: (p: PopupLoginOptions) => Promise<void>;
  handleRedirectCallback: () => Promise<void>;
  getIdTokenClaims: (p: getIdTokenClaimsOptions) => Promise<IdToken>;
  getTokenSilently: (p: GetTokenSilentlyOptions) => Promise<any>;
  getTokenWithPopup: (p: GetTokenWithPopupOptions) => Promise<string>;
  logout: (p: LogoutOptions) => void;
}

export const AuthenticationContext = React.createContext<
  IAuthenticationContext
>({
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  loginWithRedirect: () => Promise.resolve(),
  loginWithPopup: () => Promise.resolve(),
  handleRedirectCallback: () => Promise.resolve(),
  getIdTokenClaims: () => Promise.resolve({ __raw: "token" }),
  getTokenSilently: () => Promise.resolve(),
  getTokenWithPopup: () => Promise.resolve("string"),
  logout: () => { }
});

interface Props {
  domain: string;
  clientId: string;
  redirectUri: string;
  onRedirectCallback: (appState: AppState) => void;
}

export const AuthenticationContextProvider: React.FC<Props> = ({
  children,
  domain,
  clientId,
  redirectUri,
  onRedirectCallback = () =>
    window.history.replaceState({}, document.title, window.location.pathname)
}) => {
  const [authClient, setAuthClient] = useState<Auth0Client | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const callback = async () => {
      const client = await createAuth0Client({
        domain,
        client_id: clientId,
        redirect_uri: redirectUri
      });
      setAuthClient(client);

      if (
        window.location.search.includes("code=") &&
        window.location.search.includes("state=")
      ) {
        const { appState } = await client.handleRedirectCallback();
        onRedirectCallback(appState as AppState);
      }

      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        setUser(await client.getUser());
        setToken((await client.getIdTokenClaims()).__raw);
      }

      setLoading(false);
    };
    callback();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params: PopupLoginOptions = {}) => {
    try {
      await authClient!.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    }

    setUser(await authClient!.getUser());
    setToken((await authClient!.getIdTokenClaims()).__raw);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await authClient!.handleRedirectCallback();
    setUser(await authClient!.getUser());
    setToken((await authClient!.getIdTokenClaims()).__raw);
    setLoading(false);
    setIsAuthenticated(true);
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        loading,
        loginWithPopup,
        loginWithRedirect: (p: RedirectLoginOptions = {}) =>
          authClient!.loginWithRedirect(p),
        handleRedirectCallback,
        getIdTokenClaims: (p: getIdTokenClaimsOptions) =>
          authClient!.getIdTokenClaims(p),
        getTokenSilently: (p: GetTokenSilentlyOptions) =>
          authClient!.getTokenSilently(p),
        getTokenWithPopup: (p: GetTokenWithPopupOptions) =>
          authClient!.getTokenWithPopup(p),
        logout: (p: LogoutOptions = {}) => authClient!.logout(p)
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
