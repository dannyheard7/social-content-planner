import React from "react";

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
        fileUploadUrl: process.env.REACT_APP_FILE_UPLOAD_ENDPOINT,
        facebookAppId: process.env.REACT_APP_FACEBOOK_APP_ID
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
