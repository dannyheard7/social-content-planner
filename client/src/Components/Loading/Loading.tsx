import React from "react";
import { CircularProgress, Grid } from "@material-ui/core";

const Loading: React.FC = () => {
    return (
        <Grid container justify="center" item md={3} >
            <CircularProgress />
        </Grid>
    );
};

export default Loading;
