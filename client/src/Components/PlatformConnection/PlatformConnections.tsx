import { useQuery, useMutation } from "@apollo/react-hooks";
import React from "react";
import FacebookPageConnection from "./FacebookPageConnections";
import AddPlatformConnectionInput from "../../GraphQL/Inputs/AddPlatformConnectionInput";
import { ADD_PLATFORM_CONNECTION_MUTATION, AddPlatformConnectionMutationData, AddPlatformConnectionMutationVars } from "../../GraphQL/Mutations/AddPlatformConnection";
import { PLATFORM_CONNECTIONS_QUERY, PlatformConnectionQueryData } from "../../GraphQL/Queries/PlatformConnections";

const PlatformConnections: React.FC = () => {
  const { data, loading } = useQuery<PlatformConnectionQueryData>(PLATFORM_CONNECTIONS_QUERY);
  const [addPlatformMutation] = useMutation<AddPlatformConnectionMutationData, AddPlatformConnectionMutationVars>(ADD_PLATFORM_CONNECTION_MUTATION);

  if (loading) return <p>Loading</p>;

  const addPlatformConnection = (platformConnection: AddPlatformConnectionInput) => {
    addPlatformMutation({
      variables: {
        platformConnection
      }
    })
  }
  return (
    <p>
      <FacebookPageConnection addPlatformConnection={addPlatformConnection} />
    </p>
  );
};

export default PlatformConnections;
