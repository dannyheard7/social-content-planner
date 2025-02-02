import { useMutation } from '@apollo/client';
import { Dialog, DialogContent, DialogTitle, Grid, List, ListItem, ListItemText, Button } from "@material-ui/core";
import { Facebook as FacebookIcon } from "@material-ui/icons";
import React, { Fragment, useContext, useState, useEffect } from "react";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import Platform from "../../Common/Enums/Platform";
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";
import { AddPlatformConnectionMutationData, AddPlatformConnectionMutationVars, ADD_PLATFORM_CONNECTION_MUTATION } from "../../GraphQL/Mutations/AddPlatformConnection";
import { AppContext } from "../AppContext/AppContextProvider";
import { PLATFORM_CONNECTIONS_QUERY, PlatformConnectionQueryData } from '../../GraphQL/Queries/PlatformConnections';

interface Props {
    existingConnections: PlatformConnection[];
}

const FacebookPageConnection: React.FC<Props> = ({ existingConnections }) => {
    const { facebookAppId } = useContext(AppContext);
    const [accounts, setAccounts] = useState([]);
    const [userInfo, setUserInfo] = useState<any | null>(null);
    const [existingConnectionIds] = useState(existingConnections.map(pc => pc.entityId));
    const [dialogOpen, setDialogOpen] = useState(false);

    const [addPlatformMutation, { data }] = useMutation<AddPlatformConnectionMutationData, AddPlatformConnectionMutationVars>(
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
        if (data) setDialogOpen(false);
    }, [data])

    const onFacebookLogin = (userInfo: any) => {
        setUserInfo(userInfo);
        setAccounts((userInfo as any).accounts.data.filter((page: any) => !existingConnectionIds.includes(page.id)));
        setDialogOpen(true)
    }

    const onFacebookPageLink = (page: any) => {
        addPlatformMutation({
            variables:
            {
                platformConnection: {
                    entityId: page.id,
                    entityName: page.name,
                    platform: Platform[Platform.FACEBOOK],
                    platformUserId: userInfo!.id,
                    accessToken: userInfo!.accessToken
                }
            }
        });
    }

    return (
        <Fragment>
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <FacebookLogin
                        appId={facebookAppId!}
                        fields="accounts"
                        scope="manage_pages,publish_pages,read_insights"
                        callback={onFacebookLogin}
                        render={(renderProps: any) => (
                            <Button variant="contained" onClick={renderProps.onClick} style={{ backgroundColor: "#3b5998", color: "#fff" }}>
                                <FacebookIcon style={{ marginRight: '0.5rem' }} />
                                Link Facebook Page
                            </Button>
                        )}
                    />
                </Grid>
            </Grid>
            {dialogOpen &&
                <Dialog aria-labelledby="simple-dialog-title" open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle id="simple-dialog-title">Link Facebook Page</DialogTitle>
                    <DialogContent>
                        <List>
                            {accounts.map((account: any) => (
                                <ListItem button onClick={() => onFacebookPageLink(account)} key={account.id}>
                                    <ListItemText primary={account.name} />
                                </ListItem>
                            ))}
                            {accounts.length === 0 ?
                                existingConnections.length > 0 ?
                                    "You have already linked all the Facebook pages associated with your Facebook account" :
                                    "You don't seem to have any Facebook pages associated with your Facebook account"
                                : null
                            }
                        </List>
                    </DialogContent>
                </Dialog>
            }
        </Fragment>
    );
};

export default FacebookPageConnection;