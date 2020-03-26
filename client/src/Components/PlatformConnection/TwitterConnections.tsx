import { Button, Card, CardActions, CardContent, Grid, Typography } from "@material-ui/core";
import React, { Fragment, useContext, useState, useEffect } from "react";
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";
import AddPlatformConnectionInput from "../../GraphQL/Inputs/AddPlatformConnectionInput";
import { AppContext } from "../AppContext/AppContextProvider";
import { CreatePlatformOAuthTokenMutationData, CreatePlatformOAuthTokenMutationVars, CREATE_PLATFORM_OAUTH_TOKEN } from "../../GraphQL/Mutations/CreatePlatformOAuthToken";
import { useMutation } from "@apollo/react-hooks";
import Platform from "../../Common/Enums/Platform";

interface Props {
    addPlatformConnection: (connection: AddPlatformConnectionInput) => void;
    existingConnections: PlatformConnection[];
}

const TwitterConnection: React.FC<Props> = ({ addPlatformConnection, existingConnections }) => {
    const { clientAddress } = useContext(AppContext);
    const [existingConnectionIds] = useState(existingConnections.map(pc => pc.entityId));

    const [createOAuthToken, { data }] = useMutation<CreatePlatformOAuthTokenMutationData, CreatePlatformOAuthTokenMutationVars>(CREATE_PLATFORM_OAUTH_TOKEN);

    useEffect(() => {
        if (data) {
            window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${data.createPlatformOAuthToken.oauthToken}`;
        }
    }, [data])


    const onTwitterAuthenticate = async () => {
        createOAuthToken({
            variables: {
                platform: Platform.TWITTER,
                callbackUrl: `${clientAddress}/platforms`
            }
        });
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