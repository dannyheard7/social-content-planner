import React, { useContext, useEffect } from "react";
import { AuthenticationContext } from "../Authentication/AuthenticationContextProvider";

const LoginCallback: React.FC = () => {
  const { loading, handleRedirectCallback } = useContext(AuthenticationContext);

  useEffect(() => {
    if (!loading) handleRedirectCallback();
  }, [loading, handleRedirectCallback]);

  return null;
};

export default LoginCallback;
