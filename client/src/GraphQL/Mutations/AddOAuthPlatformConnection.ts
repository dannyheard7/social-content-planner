import gql from "graphql-tag";
import AddOAuthPlatformConnectionInput from "../Inputs/AddOAuthPlatformConnectionInput";
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";

export const ADD_OAUTH_PLATFORM_CONNECTION_MUTATION = gql`
mutation AddOauthPlatformConnection($platformConnection: AddOAuthPlatformConnectionInput!) {
    addOAuthPlatformConnection(platformConnection: $platformConnection) {
      id
      platform,
      entityId,
      entityName
    }
  }
`;

export interface AddOauthPlatformConnectionMutationVars {
    platformConnection: AddOAuthPlatformConnectionInput;
}

export interface AddOauthPlatformConnectionMutationData {
    addOAuthPlatformConnection: PlatformConnection;
}