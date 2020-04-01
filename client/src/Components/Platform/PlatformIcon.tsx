import { Facebook as FacebookIcon, Twitter as TwitterIcon } from '@material-ui/icons';
import React from "react";
import Platform, { PlatformType } from "../../Common/Enums/Platform";


const PlatformIcon: React.FC<{ platform: Platform | PlatformType }> = ({ platform }) => {
    switch (platform) {
        case Platform.FACEBOOK:
            return <FacebookIcon />;
        case Platform.TWITTER:
            return <TwitterIcon />;
        default:
            return null;
    }
};

export default PlatformIcon;
