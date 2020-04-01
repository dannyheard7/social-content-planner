import { useQuery } from "@apollo/react-hooks";
import React, { Fragment } from "react";
import FacebookPageConnection from "./FacebookPageConnections";

import { PLATFORM_CONNECTIONS_QUERY, PlatformConnectionQueryData } from "../../GraphQL/Queries/PlatformConnections";
import Platform from "../../Common/Enums/Platform";
import TwitterConnection from "./TwitterConnections";
import ExistingConnections from "./ExistingConnections";

const PlatformConnections: React.FC = () => {
  const { data, loading } = useQuery<PlatformConnectionQueryData>(PLATFORM_CONNECTIONS_QUERY);

  if (loading) return <p>Loading</p>;
  if (!data) return <p>Error loading data</p>;

  const platformConnections = data.platformConnections.map(pc => ({ ...pc, platform: Platform[pc.platform] }));

  return (
    <Fragment>
      <ExistingConnections existingConnections={platformConnections} />
      <FacebookPageConnection
        existingConnections={platformConnections.filter(pc => pc.platform === Platform.FACEBOOK)} />
      <TwitterConnection />
    </Fragment>
  );
};

export default PlatformConnections;
