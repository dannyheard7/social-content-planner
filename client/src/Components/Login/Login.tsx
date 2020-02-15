import { Button } from "@material-ui/core";
import React, { useContext } from "react";
import { AuthenticationContext } from "../Authentication/AuthenticationContextProvider";

const Login: React.FC = () => {
  const { loginWithRedirect } = useContext(AuthenticationContext);

  return <Button onClick={loginWithRedirect}>Login</Button>;
};

export default Login;
