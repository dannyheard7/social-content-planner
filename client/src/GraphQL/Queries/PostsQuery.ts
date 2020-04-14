import { gql } from '@apollo/client';
import Platform from '../../Common/Enums/Platform';
import { PostStatus } from '../../Common/Interfaces/PostStatus';

export const POSTS_QUERY = gql`
  query Posts {
    posts {
      id
      text
      createdAt
      platforms {
        id
        platform
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
      id: string,
      platform: Platform
    }[],
    latestStatus: PostStatus
  }[]
}