import gql from "graphql-tag";
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";

export const POST_QUERY = gql`
  query Posts($id: ID!) {
    post(id: $id) {
      id
      text
      createdAt
      media {
        fileId
      }
      platforms {
        platformEntityUrl
        platformConnection {
          id
          platform
        }
      }
      status {
        positiveReactionsCount
        negativeReactionsCount
        timestamp
      }
    }
  }
`;

export interface PostQueryVars {
  id: string;
}

export interface PostQueryData {
  post: {
    id: string;
    text: string;
    createdAt: string;
    platforms: {
      platformEntityUrl: string;
      platformConnection: PlatformConnection
    }[],
    media: {
      fileId: string
    }[],
    status: PostStatus[]
  }
}

interface PostStatus {
  positiveReactionsCount: number
  negativeReactionsCount: number
  timestamp: Date
}