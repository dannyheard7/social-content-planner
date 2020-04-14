import { gql } from '@apollo/client';
import Platform from '../../Common/Enums/Platform';
import { PostStatus } from '../../Common/Interfaces/PostStatus';

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
        id
        platformEntityUrl
        platform
      }
      status {
        positiveReactionsCount
        negativeReactionsCount
        sharesCount
        commentsCount
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
      id: string,
      platformEntityUrl: string;
      platform: Platform
    }[],
    media: {
      fileId: string
    }[],
    status: PostStatus[]
  }
}