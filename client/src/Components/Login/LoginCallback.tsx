import React, { useContext, useEffect } from "react";
import { AuthenticationContext } from "../Authentication/AuthenticationContextProvider";

const LoginCallback: React.FC = () => {
  const { handleRedirectCallback } = useContext(AuthenticationContext);

  useEffect(() => {
    handleRedirectCallback();
  }, [handleRedirectCallback]);

  return null;
};

export default LoginCallback;
