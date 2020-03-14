import gql from "graphql-tag";
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";

export const PLATFORM_CONNECTIONS_QUERY = gql`
  query PlatformConnections {
    platformConnections {
      platform,
      entityId
    }
  }
`;

export interface PlatformConnectionQueryData {
  platformConnections: PlatformConnection[];
}