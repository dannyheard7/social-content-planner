import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Button, Card, CardActions, CardContent, Grid, Typography } from "@material-ui/core";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Platform from "../../Common/Enums/Platform";
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";
import { AddOauthPlatformConnectionMutationData, AddOauthPlatformConnectionMutationVars, ADD_OAUTH_PLATFORM_CONNECTION_MUTATION } from "../../GraphQL/Mutations/AddOAuthPlatformConnection";
import { GetPlatformOAuthRequestTokenQueryData, GetPlatformOAuthRequestTokenQueryVars, GET_PLATFORM_OAUTH_REQUEST_TOKEN } from "../../GraphQL/Queries/GetPlatformOAuthRequestToken";
import { AppContext } from "../AppContext/AppContextProvider";

interface Props {
    existingConnections: PlatformConnection[];
}

const TwitterConnection: React.FC<Props> = ({ existingConnections }) => {
    const { clientAddress } = useContext(AppContext);
    const [existingConnectionIds] = useState(existingConnections.map(pc => pc.entityId));
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);

    const [getOauthToken, { data }] = useLazyQuery<GetPlatformOAuthRequestTokenQueryData, GetPlatformOAuthRequestTokenQueryVars>(GET_PLATFORM_OAUTH_REQUEST_TOKEN);

    useEffect(() => {
        if (data) {
            window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${data.getPlatformOAuthRequestToken.oauthToken}`;
        }
    }, [data]);

    const [addPlatformMutation] = useMutation<AddOauthPlatformConnectionMutationData, AddOauthPlatformConnectionMutationVars>(
        ADD_OAUTH_PLATFORM_CONNECTION_MUTATION);


    const onTwitterAuthenticate = async () => {
        getOauthToken({
            variables: {
                platform: Platform.TWITTER,
                callbackUrl: `${clientAddress}/platforms`
            }
        });
    }

    if (queryParams.get("oauth_token") && queryParams.get("oauth_verifier")) {
        addPlatformMutation({
            variables:
            {
                platformConnection: {
                    oauthToken: queryParams.get("oauth_token")!,
                    oauthTokenSecret: queryParams.get("oauth_token")!,
                    oauthVerifier: queryParams.get("oauth_verifier")!,
                    platform: Platform[Platform.TWITTER]
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
                    <Button onClick={(e) => onTwitterAuthenticate()}>Link Twitter</Button>
                </Grid>
            </Grid>
        </Fragment>
    );
};

export default TwitterConnection;