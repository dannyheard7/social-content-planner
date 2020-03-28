import gql from "graphql-tag";
import AddOAuthPlatformConnectionInput from "../Inputs/AddOAuthPlatformConnectionInput";

export const ADD_OAUTH_PLATFORM_CONNECTION_MUTATION = gql`
mutation AddOauthPlatformConnection($platformConnection: AddPlatformConnectionInput!) {
    addOauthPlatformConnection(platformConnection: $platformConnection)
  }
`;

export interface AddOauthPlatformConnectionMutationVars {
    platformConnection: AddOAuthPlatformConnectionInput;
}

export interface AddOauthPlatformConnectionMutationData {
    addOauthPlatformConnection: boolean;
}