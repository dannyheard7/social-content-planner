import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";

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

  if (loading) return <p>Loading</p>

  return (
    <p>
      {data.platformConnections}
    </p>
  );
};

export default PlatformConnections;
