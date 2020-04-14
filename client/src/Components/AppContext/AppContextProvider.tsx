import React from "react";
import config from '../../config';

interface IAppContext {
  filesEndpoint?: string;
  facebookAppId?: string;
  clientAddress?: string;
  recaptchaSiteKey: string;
}

export const AppContext = React.createContext<
  IAppContext
>({ recaptchaSiteKey: "" });

export const AppContextProvider: React.FC = ({
  children,
}) => {
  return (
    <AppContext.Provider
      value={{
        filesEndpoint: config.FILES_ENDPOINT,
        facebookAppId: config.FACEBOOK_APP_ID,
        clientAddress: `${window.location.protocol}//${config.CLIENT_ADDRESS}`,
        recaptchaSiteKey: config.RECAPTCHA_SITE_KEY
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
