import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import FacebookLogin, { ReactFacebookLoginInfo } from "react-facebook-login";

const PLATFORM_CONNECTIONS_QUERY = gql`
  query PlatformConnections {
    platformConnections {
      network,
      entityId
    }
  }
`;

const ADD_PLATFORM_CONNECTION_MUTATION = gql`
mutation AddPlatformConnection($platformConnection: AddPlatformConnectionInput!) {
    addPlatformConnection(platformConnection: $platformConnection)
  }
`;
const PlatformConnections: React.FC = () => {
  const { data, loading } = useQuery(PLATFORM_CONNECTIONS_QUERY);
  const [addPlatformMutation] = useMutation(ADD_PLATFORM_CONNECTION_MUTATION);

  if (loading) return <p>Loading</p>;

  // TODO: once we have logged in with facebook, we must get a long-lived access token, then get a long lived page token

  const onFacebookLink = (userInfo: ReactFacebookLoginInfo) => {
    addPlatformMutation({
      variables: {
        platformConnection: {
          entityId: "104703471133712",
          platform: "Facebook",
          platformUserId: userInfo.id,
          accessToken: userInfo.accessToken
        }
      }
    })
  }
  return (
    <p>
      {data.platformConnections}
      <FacebookLogin
        appId="2002136040088512"
        autoLoad={true}
        fields="accounts"
        callback={onFacebookLink}
      />
    </p>
  );
};

export default PlatformConnections;
