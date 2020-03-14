import gql from "graphql-tag";
import AddPlatformConnectionInput from "../Inputs/AddPlatformConnectionInput";

export const ADD_PLATFORM_CONNECTION_MUTATION = gql`
mutation AddPlatformConnection($platformConnection: AddPlatformConnectionInput!) {
    addPlatformConnection(platformConnection: $platformConnection)
  }
`;

export interface AddPlatformConnectionMutationVars {
    platformConnection: AddPlatformConnectionInput;
}

export interface AddPlatformConnectionMutationData {
    addPlatformConnection: boolean;
}