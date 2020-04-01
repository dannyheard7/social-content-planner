import { Button, Card, CardActions, CardContent, Grid, Icon, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";
import PlatformIcon from "../Platform/PlatformIcon";


interface Props {
    existingConnections: PlatformConnection[];
}

const ExistingConnections: React.FC<Props> = ({ existingConnections }) => {
    return (
        <Fragment>
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <Typography>You have {existingConnections.length} linked Platform{existingConnections.length !== 1 && 's'}</Typography>
                </Grid>
                <Grid container item spacing={1}>
                    {existingConnections.map(pc => {
                        return (
                            <Grid item md={3}>
                                <Card >
                                    <CardContent>
                                        <Icon>
                                            <PlatformIcon platform={pc.platform} />
                                        </Icon>
                                        <Typography >
                                            {pc.entityName}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">Remove</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
        </Fragment>
    );
};

export default ExistingConnections;