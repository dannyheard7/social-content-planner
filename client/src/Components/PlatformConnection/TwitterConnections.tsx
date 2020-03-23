import { Button, Card, CardActions, CardContent, Grid, Typography } from "@material-ui/core";
import React, { Fragment, useContext, useState } from "react";
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";
import AddPlatformConnectionInput from "../../GraphQL/Inputs/AddPlatformConnectionInput";
import { AppContext } from "../AppContext/AppContextProvider";

interface Props {
    addPlatformConnection: (connection: AddPlatformConnectionInput) => void;
    existingConnections: PlatformConnection[];
}

const TwitterConnection: React.FC<Props> = ({ addPlatformConnection, existingConnections }) => {
    const { clientAddress, twitterApiKey } = useContext(AppContext);
    const [existingConnectionIds] = useState(existingConnections.map(pc => pc.entityId));


    const onTwitterAuthenticate = async () => {
        // TODO: this has to be done from a backend service
        const res = await fetch(`https://api.twitter.com/oauth/request_token?oauth_callback="${clientAddress}/platforms"&oauth_consumer_key="${twitterApiKey}"`);
        const { oauth_token, oauth_token_secret, oauth_callback_confirmed } = await res.json();

        window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${oauth_token}`;
    }

    // const onFacebookPageLink = (page: any) => {
    //     addPlatformConnection({
    //         entityId: page.id,
    //         entityName: page.name,
    //         platform: Platform[Platform.FACEBOOK],
    //         platformUserId: userInfo!.id,
    //         accessToken: userInfo!.accessToken
    //     })
    // }

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
                    <Button onClick={(e) => onTwitterAuthenticate()}>Link Twitter</Button>
                </Grid>
            </Grid>
        </Fragment>
    );
};

export default TwitterConnection;