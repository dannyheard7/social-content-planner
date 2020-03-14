import React, { useState } from "react";
import FacebookLogin, { ReactFacebookLoginInfo } from "react-facebook-login";
import AddPlatformConnectionInput from "../../GraphQL/Inputs/AddPlatformConnectionInput";
import { Dialog, DialogTitle, List, ListItem, ListItemText } from "@material-ui/core";
import Platform from "../../Common/Enums/Platform";
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";

interface Props {
    addPlatformConnection: (connection: AddPlatformConnectionInput) => void;
    existingConnections: PlatformConnection[];
}

const FacebookPageConnection: React.FC<Props> = ({ addPlatformConnection }) => {
    const [accounts, setAccounts] = useState();
    const [userInfo, setUserInfo] = useState<ReactFacebookLoginInfo | null>(null);

    const onFacebookLogin = (userInfo: ReactFacebookLoginInfo) => {
        setUserInfo(userInfo);
        setAccounts((userInfo as any).accounts)
    }

    const onFacebookPageLink = (page: any) => {
        addPlatformConnection({
            entityId: page.id,
            entityName: page.name,
            platform: Platform[Platform.FACEBOOK],
            platformUserId: userInfo!.id,
            accessToken: userInfo!.accessToken
        })
    }

    if (accounts) {
        return (
            <Dialog aria-labelledby="simple-dialog-title" open>
                <DialogTitle id="simple-dialog-title">Link Facebook Page</DialogTitle>
                <List>
                    {accounts.data.map((account: any) => (
                        <ListItem button onClick={() => onFacebookPageLink(account)} key={account.id}>
                            <ListItemText primary={account.name} />
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        )
    }

    return (
        <p>
            <FacebookLogin
                appId="2002136040088512"
                fields="accounts"
                callback={onFacebookLogin}
            />
        </p>
    );
};

export default FacebookPageConnection;
