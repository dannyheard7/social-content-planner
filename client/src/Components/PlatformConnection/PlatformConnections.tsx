import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import FacebookLogin from "react-facebook-login";

const PLATFORM_CONNECTIONS_QUERY = gql`
  query PlatformConnections {
    platformConnections {
      network,
      entityId
    }
  }
`;

const PlatformConnections: React.FC = () => {
  const { data, loading } = useQuery(PLATFORM_CONNECTIONS_QUERY);

  if (loading) return <p>Loading</p>;

  // TODO: once we have logged in with facebook, we must get a long-lived access token, then get a long lived page token

  return (
    <p>
      {data.platformConnections}
      <FacebookLogin
        appId="2002136040088512"
        autoLoad={true}
        fields="accounts"
        callback={console.log}
      />
    </p>
  );
};

export default PlatformConnections;
