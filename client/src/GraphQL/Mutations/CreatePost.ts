import gql from 'graphql-tag';

export const CREATE_POST_MUTATION = gql`
  mutation createPost($post: PostInput!) {
    createPost(post: $post)
  }
`;
