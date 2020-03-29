import gql from "graphql-tag";
import AddPlatformConnectionInput from "../Inputs/AddPlatformConnectionInput";
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";

export const ADD_PLATFORM_CONNECTION_MUTATION = gql`
mutation AddPlatformConnection($platformConnection: AddPlatformConnectionInput!) {
    addPlatformConnection(platformConnection: $platformConnection) {
      id
      platform,
      entityId,
      entityName
    }
  }
`;

export interface AddPlatformConnectionMutationVars {
    platformConnection: AddPlatformConnectionInput;
}

export interface AddPlatformConnectionMutationData {
    addPlatformConnection: PlatformConnection;
}