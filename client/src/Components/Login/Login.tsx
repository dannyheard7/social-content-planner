import { Button, Grid, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { AuthenticationContext } from "../Authentication/AuthenticationContextProvider";

const Login: React.FC = () => {
  const { loginWithRedirect } = useContext(AuthenticationContext);

  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Typography variant="h3" component="h1">Welcome to Elevait</Typography>
      </Grid>
      <Grid item md={12}>
        <Typography>At Elevait you can manage your social media presence in one location, creating posts quickly and provide easy to understand analytics</Typography>
      </Grid>
      <Grid item md={12}>
        <Typography>We are currently integrated with Facebook and Twitter, and will continue adding more networks</Typography>
      </Grid>
      <Grid item md={12}>
        <Button variant="contained" color="primary" onClick={loginWithRedirect}>Login</Button>
      </Grid>
    </Grid>
  );
}

export default Login;
