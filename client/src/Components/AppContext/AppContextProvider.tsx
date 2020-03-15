import React from "react";
import config from '../../config';

interface IAppContext {
  fileUploadUrl?: string;
  facebookAppId?: string;
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
        fileUploadUrl: config.FILE_UPLOAD_ENDPOINT,
        facebookAppId: config.FACEBOOK_APP_ID
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
