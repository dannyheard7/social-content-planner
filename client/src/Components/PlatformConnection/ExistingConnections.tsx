import { useMutation } from "@apollo/client";
import { Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Icon, Typography } from "@material-ui/core";
import React, { Fragment, useState } from "react";
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";
import { RemovePlatformConnectionMutationData, RemovePlatformConnectionMutationVars, REMOVE_PLATFORM_CONNECTION_MUTATION } from "../../GraphQL/Mutations/RemovePlatformConnection";
import { PlatformConnectionQueryData, PLATFORM_CONNECTIONS_QUERY } from "../../GraphQL/Queries/PlatformConnections";
import PlatformIcon from "../Platform/PlatformIcon";

interface Props {
    existingConnections: PlatformConnection[];
}

const ConfirmRemoveDialog: React.FC<{ onClose: () => void, open: boolean, platformConnection: PlatformConnection | null }> = ({ onClose, open, platformConnection }) => {
    const [removePlatformMutation] = useMutation<RemovePlatformConnectionMutationData, RemovePlatformConnectionMutationVars>(
        REMOVE_PLATFORM_CONNECTION_MUTATION,
        {
            update(cache, { data: { removePlatformConnection } }) {
                if (removePlatformConnection) {
                    const data = cache.readQuery<PlatformConnectionQueryData>({ query: PLATFORM_CONNECTIONS_QUERY });

                    cache.writeQuery<PlatformConnectionQueryData>({
                        query: PLATFORM_CONNECTIONS_QUERY,
                        data: {
                            platformConnections: data?.platformConnections.filter(pc => pc.id !== removePlatformConnection) || []
                        },
                    });
                }
            }
        }
    );

    const onRemoveClick = () => {
        removePlatformMutation({
            variables: {
                id: platformConnection!.id
            }
        });

        onClose();
    }

    return (
        <Dialog onClose={() => onClose()} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Confirm Removal</DialogTitle>
            <DialogContent>
                <Typography>Removing the platform {platformConnection?.entityName} will cause all polling (e.g. stats) for this platform to stop</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => onRemoveClick()} color="primary">
                    Remove
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const ExistingConnections: React.FC<Props> = ({ existingConnections }) => {
    const [removePlatformConnection, setRemovePlatformConnection] = useState<PlatformConnection | null>(null);

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
                                        <Button size="small" onClick={() => setRemovePlatformConnection(pc)}>Remove</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
                <ConfirmRemoveDialog open={removePlatformConnection !== null} onClose={() => setRemovePlatformConnection(null)} platformConnection={removePlatformConnection} />
            </Grid>
        </Fragment>
    );
};

export default ExistingConnections;