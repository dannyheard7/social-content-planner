import { gql } from '@apollo/client';
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";

export const PLATFORM_CONNECTIONS_QUERY = gql`
  query PlatformConnections {
    platformConnections {
      id
      platform,
      entityId,
      entityName
    }
  }
`;

export interface PlatformConnectionQueryData {
  platformConnections: PlatformConnection[];
}