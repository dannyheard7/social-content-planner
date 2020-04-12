import { gql } from '@apollo/client';
import PlatformConnection from "../../Common/Interfaces/PlatformConnection";
import { PostStatus } from '../../Common/Interfaces/PostStatus';

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
      latestStatus {
        positiveReactionsCount
        negativeReactionsCount
        sharesCount
        commentsCount
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
    }[],
    latestStatus: PostStatus
  }[]
}