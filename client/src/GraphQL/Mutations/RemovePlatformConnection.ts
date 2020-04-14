import { gql } from '@apollo/client';

export const REMOVE_PLATFORM_CONNECTION_MUTATION = gql`
  mutation removePlatformConnection($id: ID!) {
    removePlatformConnection(id: $id)
  }
`;

export interface RemovePlatformConnectionMutationVars {
  id: string,
}

export interface RemovePlatformConnectionMutationData {
  removePlatformConnection: string
}