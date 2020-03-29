import gql from "graphql-tag";
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";

export const POSTS_QUERY = gql`
  query Posts {
    posts {
      id
      text
      platforms {
        platformEntityUrl
        platformConnection {
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
    platforms: {
      platformEntityUrl: string;
      platformConnection: PlatformConnection
    }[]
  }[]
}