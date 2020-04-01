import React from "react";
import config from '../../config';

interface IAppContext {
  filesEndpoint?: string;
  facebookAppId?: string;
  clientAddress?: string
}

export const AppContext = React.createContext<
  IAppContext
>({});

export const AppContextProvider: React.FC = ({
  children,
}) => {
  return (
    <AppContext.Provider
      value={{
        filesEndpoint: config.FILES_ENDPOINT,
        facebookAppId: config.FACEBOOK_APP_ID,
        clientAddress: `${window.location.protocol}//${config.CLIENT_ADDRESS}`
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
