import { gql } from '@apollo/client';
import CreatePostInput from '../Inputs/CreatePostInput';

export const CREATE_POST_MUTATION = gql`
  mutation createPost($post: PostInput!) {
    createPost(post: $post) {
      id
    }
  }
`;

export interface CreatePostMutationVars {
  post: CreatePostInput;
}

export interface CreatePostMutationData {
  post: {
    id: string;
  };
}