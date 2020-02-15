import createAuth0Client from "@auth0/auth0-spa-js";
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client";
import React, { useState, useEffect } from "react";

interface IAuthenticationContext {
  isAuthenticated: boolean;
  idToken: IdToken | null;
  handleRedirectCallback: () => Promise<void>;
  loginWithRedirect: () => Promise<void>;
}

export const AuthenticationContext = React.createContext<
  IAuthenticationContext
>({
  isAuthenticated: false,
  idToken: null,
  handleRedirectCallback: () => Promise.resolve(),
  loginWithRedirect: () => Promise.resolve()
});

interface Props {
  domain: string;
  clientId: string;
  redirectUri: string;
}

export const AuthenticationContextProvider: React.FC<Props> = ({
  children,
  domain,
  clientId,
  redirectUri
}) => {
  const [authClient, setAuthClient] = useState<Auth0Client | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [idToken, setIdToken] = useState<IdToken | null>(null);

  useEffect(() => {
    const callback = async () => {
      setAuthClient(
        await createAuth0Client({
          domain,
          client_id: clientId,
          redirect_uri: redirectUri
        })
      );
    };
    callback();
    // eslint-disable-next-line
  }, []);

  const handleRedirectCallback = async () => {
    await authClient!.handleRedirectCallback();
    setIsAuthenticated(await authClient!.isAuthenticated());
  };

  const loginWithRedirect = async () => {
    await authClient!.loginWithRedirect();
  };

  useEffect(() => {
    const callback = async () =>
      setIdToken(await authClient!.getIdTokenClaims());
    if (isAuthenticated) callback();
    else setIdToken(null);
  }, [isAuthenticated, authClient]);

  if (!authClient) return <p>Loading</p>;

  return (
    <AuthenticationContext.Provider
      value={{
        handleRedirectCallback,
        isAuthenticated,
        idToken,
        loginWithRedirect
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
