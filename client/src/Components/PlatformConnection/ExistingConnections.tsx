import { Button, Card, CardActions, CardContent, Grid, Typography, Icon } from "@material-ui/core";

import React, { Fragment, useState } from "react";
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";
import Platform from "../../Common/Enums/Platform";
import PlatformIcon from "../Platform/PlatformIcon";

interface Props {
    existingConnections: PlatformConnection[];
}

const ExistingConnections: React.FC<Props> = ({ existingConnections }) => {
    const [existingConnectionIds] = useState(existingConnections.map(pc => pc.entityId));

    return (
        <Fragment>
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <Typography>You have {existingConnections.length} linked Platform{existingConnections.length !== 1 && 's'}</Typography>
                </Grid>
                <Grid container item>
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