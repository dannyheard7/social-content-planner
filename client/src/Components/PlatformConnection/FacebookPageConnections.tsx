import { useMutation } from "@apollo/react-hooks";
import { Button, Card, CardActions, CardContent, Dialog, DialogContent, DialogTitle, Grid, List, ListItem, ListItemText, Typography } from "@material-ui/core";
import React, { Fragment, useContext, useState } from "react";
import FacebookLogin, { ReactFacebookLoginInfo } from "react-facebook-login";
import Platform from "../../Common/Enums/Platform";
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";
import { AddPlatformConnectionMutationData, AddPlatformConnectionMutationVars, ADD_PLATFORM_CONNECTION_MUTATION } from "../../GraphQL/Mutations/AddPlatformConnection";
import { AppContext } from "../AppContext/AppContextProvider";

interface Props {
    existingConnections: PlatformConnection[];
}

const FacebookPageConnection: React.FC<Props> = ({ existingConnections }) => {
    const { facebookAppId } = useContext(AppContext);
    const [accounts, setAccounts] = useState([]);
    const [userInfo, setUserInfo] = useState<ReactFacebookLoginInfo | null>(null);
    const [existingConnectionIds] = useState(existingConnections.map(pc => pc.entityId));
    const [dialogOpen, setDialogOpen] = useState(false);

    const [addPlatformMutation] = useMutation<AddPlatformConnectionMutationData, AddPlatformConnectionMutationVars>(ADD_PLATFORM_CONNECTION_MUTATION);

    const onFacebookLogin = (userInfo: ReactFacebookLoginInfo) => {
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
                    <Typography>You have {existingConnections.length} linked Facebook Page{existingConnections.length !== 1 && 's'}</Typography>
                </Grid>
                <Grid container item>
                    {existingConnections.map(pc => {
                        return (
                            <Grid item md={3}>
                                <Card >
                                    <CardContent>
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
                <Grid item>
                    <FacebookLogin
                        appId={facebookAppId!}
                        fields="accounts"
                        scope="manage_pages,publish_pages"
                        callback={onFacebookLogin}
                        textButton={existingConnections.length > 0 ? "Link Another Page" : "Link Facebook Page"}
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