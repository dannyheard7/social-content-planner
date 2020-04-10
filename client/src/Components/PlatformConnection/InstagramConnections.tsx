import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Dialog, DialogContent, DialogTitle, Grid, List, ListItem, ListItemText, Typography } from "@material-ui/core";
import { Instagram as InstagramIcon } from "@material-ui/icons";
import React, { Fragment, useEffect, useState } from "react";
import { AddPlatformConnectionMutationData, AddPlatformConnectionMutationVars, ADD_PLATFORM_CONNECTION_MUTATION } from "../../GraphQL/Mutations/AddPlatformConnection";
import { GetAvailableInstagramAccountsQueryData, GET_AVAILABLE_INSTAGRAM_ACCOUNTS_QUERY } from '../../GraphQL/Queries/GetAvailableInstagramAccounts';
import { PlatformConnectionQueryData, PLATFORM_CONNECTIONS_QUERY } from '../../GraphQL/Queries/PlatformConnections';

const InstagramConnection: React.FC = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [getAvailableInstagramAccounts, { data, error }] = useLazyQuery<GetAvailableInstagramAccountsQueryData>(GET_AVAILABLE_INSTAGRAM_ACCOUNTS_QUERY);

    const [addPlatformMutation, { data: mutationData }] = useMutation<AddPlatformConnectionMutationData, AddPlatformConnectionMutationVars>(
        ADD_PLATFORM_CONNECTION_MUTATION,
        {
            update(cache, { data: { addPlatformConnection } }) {
                const data = cache.readQuery<PlatformConnectionQueryData>({ query: PLATFORM_CONNECTIONS_QUERY });

                cache.writeQuery<PlatformConnectionQueryData>({
                    query: PLATFORM_CONNECTIONS_QUERY,
                    data: {
                        platformConnections: data ?
                            [...data.platformConnections, addPlatformConnection] :
                            [addPlatformConnection]
                    },
                });
            }
        }
    );

    useEffect(() => {
        if (mutationData) setDialogOpen(false);
    }, [mutationData])

    useEffect(() => {
        if (data) setDialogOpen(true);
    }, [data])

    const onLinkInstagramButtonPress = () => {
        getAvailableInstagramAccounts();
    }

    const onTwitterPageLink = (page: any) => {
        // addPlatformMutation({
        //     variables:
        //     {
        //         platformConnection: {
        //             entityId: page.id,
        //             entityName: page.username,
        //             platform: Platform[Platform.FACEBOOK],
        //             platformUserId: userInfo!.id,
        //             accessToken: userInfo!.accessToken
        //         }
        //     }
        // });
    }

    return (
        <Fragment>
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={(e) => onLinkInstagramButtonPress()}>
                        <InstagramIcon style={{ marginRight: '0.5rem' }} />
                        Link Instagram
                    </Button>
                </Grid>
            </Grid>
            {dialogOpen &&
                <Dialog aria-labelledby="simple-dialog-title" open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle id="simple-dialog-title">Choose Instagram Account</DialogTitle>
                    <DialogContent>
                        {data?.getAvailableInstagramAccounts.length === 0 ?
                            <Typography>To link an instagram account, you have to have linked it to your facebook page and linked that facebook page on Elevait</Typography> :
                            <List>
                                {data?.getAvailableInstagramAccounts.map((account) => (
                                    <ListItem button onClick={() => onTwitterPageLink(account)} key={account.id}>
                                        <ListItemText primary={account.username} />
                                    </ListItem>
                                ))}
                            </List>
                        }
                    </DialogContent>
                </Dialog>
            }
        </Fragment>
    );
};

export default InstagramConnection;