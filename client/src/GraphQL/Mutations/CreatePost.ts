import { gql } from '@apollo/client';
import CreatePostInput from '../Inputs/CreatePostInput';

export const CREATE_POST_MUTATION = gql`
  mutation createPost($post: PostInput!) {
    createPost(post: $post) {
      id
      text
      createdAt
    }
  }
`;

export interface CreatePostMutationVars {
  post: CreatePostInput;
}

export interface CreatePostMutationData {
  createPost: {
    id: string;
    text: string;
    createdAt: string;
  };
}