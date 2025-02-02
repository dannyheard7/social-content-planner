import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Grid } from "@material-ui/core";
import { Twitter as TwitterIcon } from "@material-ui/icons";
import React, { Fragment, useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Platform from "../../Common/Enums/Platform";
import { AddOauthPlatformConnectionMutationData, AddOauthPlatformConnectionMutationVars, ADD_OAUTH_PLATFORM_CONNECTION_MUTATION } from "../../GraphQL/Mutations/AddOAuthPlatformConnection";
import { GetPlatformOAuthRequestTokenQueryData, GetPlatformOAuthRequestTokenQueryVars, GET_PLATFORM_OAUTH_REQUEST_TOKEN } from "../../GraphQL/Queries/GetPlatformOAuthRequestToken";
import { AppContext } from "../AppContext/AppContextProvider";
import { PlatformConnectionQueryData, PLATFORM_CONNECTIONS_QUERY } from '../../GraphQL/Queries/PlatformConnections';

const TwitterConnection: React.FC = () => {
    const { clientAddress } = useContext(AppContext);
    const { search } = useLocation();
    const { push } = useHistory();
    const queryParams = new URLSearchParams(search);

    const [getOauthToken, { data, error }] = useLazyQuery<GetPlatformOAuthRequestTokenQueryData, GetPlatformOAuthRequestTokenQueryVars>(GET_PLATFORM_OAUTH_REQUEST_TOKEN);

    useEffect(() => {
        if (data) {
            sessionStorage.setItem("oauthSecret", data.getPlatformOAuthRequestToken.oauthTokenSecret);
            window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${data.getPlatformOAuthRequestToken.oauthToken}`;
        }
    }, [data]);

    const [addPlatformMutation] = useMutation<AddOauthPlatformConnectionMutationData, AddOauthPlatformConnectionMutationVars>(
        ADD_OAUTH_PLATFORM_CONNECTION_MUTATION,
        {
            update(cache, { data: { addOAuthPlatformConnection } }) {
                const data = cache.readQuery<PlatformConnectionQueryData>({ query: PLATFORM_CONNECTIONS_QUERY });

                cache.writeQuery<PlatformConnectionQueryData>({
                    query: PLATFORM_CONNECTIONS_QUERY,
                    data: {
                        platformConnections: data ?
                            [...data.platformConnections, addOAuthPlatformConnection] :
                            [addOAuthPlatformConnection]
                    },
                });
            }
        });

    useEffect(() => {
        if (queryParams.get("oauth_token") && queryParams.get("oauth_verifier") && sessionStorage.getItem("oauthSecret")) {
            addPlatformMutation({
                variables:
                {
                    platformConnection: {
                        oauthToken: queryParams.get("oauth_token")!,
                        oauthTokenSecret: sessionStorage.getItem("oauthSecret")!,
                        oauthVerifier: queryParams.get("oauth_verifier")!,
                        platform: Platform[Platform.TWITTER]
                    }
                }
            });
            sessionStorage.removeItem("oauthSecret")
        }
        // eslint-disable-next-line
    }, []);

    if (error) { push("/platforms"); }

    const onTwitterAuthenticate = async () => {
        getOauthToken({
            variables: {
                platform: Platform.TWITTER,
                callbackUrl: `${clientAddress}/platforms`
            }
        });
    }

    return (
        <Fragment>
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <Button variant="contained" onClick={(e) => onTwitterAuthenticate()} style={{ backgroundColor: "#1DA1F2", color: "#fff" }}>
                        <TwitterIcon style={{ marginRight: '0.5rem' }} />
                        Link Twitter Account
                    </Button>
                </Grid>
            </Grid>
        </Fragment>
    );
};

export default TwitterConnection;