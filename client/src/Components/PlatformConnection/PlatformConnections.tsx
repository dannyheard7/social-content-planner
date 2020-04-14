import { useQuery } from '@apollo/client';
import { Grid, Typography } from '@material-ui/core';
import React from "react";
import Platform from "../../Common/Enums/Platform";
import { PlatformConnectionQueryData, PLATFORM_CONNECTIONS_QUERY } from "../../GraphQL/Queries/PlatformConnections";
import Loading from "../Loading/Loading";
import ExistingConnections from "./ExistingConnections";
import FacebookPageConnection from "./FacebookPageConnections";
import TwitterConnection from "./TwitterConnections";


const PlatformConnections: React.FC = () => {
  const { data, loading } = useQuery<PlatformConnectionQueryData>(PLATFORM_CONNECTIONS_QUERY);

  if (loading) return <Loading />;
  if (!data) return <p>Error loading data</p>;

  const platformConnections = data.platformConnections.map(pc => ({ ...pc, platform: Platform[pc.platform] }));

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h2" component="h1">Platforms</Typography>
      </Grid>
      <Grid item xs={12}>
        <ExistingConnections existingConnections={platformConnections} />
      </Grid>
      <Grid item xs={12}>
        <FacebookPageConnection
          existingConnections={platformConnections.filter(pc => pc.platform === Platform.FACEBOOK)} />
      </Grid>
      <Grid item xs={12}>
        <TwitterConnection />
      </Grid>
    </Grid>
  );
};

export default PlatformConnections;
