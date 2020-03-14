import { useQuery, useMutation } from "@apollo/react-hooks";
import React from "react";
import FacebookPageConnection from "./FacebookPageConnections";
import AddPlatformConnectionInput from "../../GraphQL/Inputs/AddPlatformConnectionInput";
import { ADD_PLATFORM_CONNECTION_MUTATION, AddPlatformConnectionMutationData, AddPlatformConnectionMutationVars } from "../../GraphQL/Mutations/AddPlatformConnection";
import { PLATFORM_CONNECTIONS_QUERY, PlatformConnectionQueryData } from "../../GraphQL/Queries/PlatformConnections";
import Platform from "../../Common/Enums/Platform";

const PlatformConnections: React.FC = () => {
  const { data, loading } = useQuery<PlatformConnectionQueryData>(PLATFORM_CONNECTIONS_QUERY);
  const [addPlatformMutation] = useMutation<AddPlatformConnectionMutationData, AddPlatformConnectionMutationVars>(ADD_PLATFORM_CONNECTION_MUTATION);

  if (loading) return <p>Loading</p>;
  if (!data) return <p>"Error loading data"</p>;

  const addPlatformConnection = (platformConnection: AddPlatformConnectionInput) => {
    addPlatformMutation({
      variables: {
        platformConnection
      }
    })
  }
  return (
    <p>
      <FacebookPageConnection addPlatformConnection={addPlatformConnection}
        existingConnections={data.platformConnections.filter(pc => pc.platform === Platform.FACEBOOK)} />
    </p>
  );
};

export default PlatformConnections;
