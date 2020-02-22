import React from "react";

interface IAppContext {
  fileUploadUrl: string | null;
}

export const AppContext = React.createContext<
  IAppContext
>({
  fileUploadUrl: null
});

export const AppContextProvider: React.FC = ({
  children,
}) => {
  return (
    <AppContext.Provider
      value={{
        fileUploadUrl: process.env.REACT_APP_FILE_UPLOAD_ENDPOINT!
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
