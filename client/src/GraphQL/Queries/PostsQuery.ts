import gql from "graphql-tag";
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";

export const POSTS_QUERY = gql`
  query Posts {
    posts {
      id
      text
      createdAt
      platforms {
        platformConnection {
          id
          platform
        }
      }
    }
  }
`;

export interface PostsQueryData {
  posts: {
    id: string;
    text: string;
    createdAt: string;
    platforms: {
      platformConnection: PlatformConnection
    }[]
  }[]
}