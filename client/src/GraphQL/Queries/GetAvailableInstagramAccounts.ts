import { gql } from '@apollo/client';

export const GET_AVAILABLE_INSTAGRAM_ACCOUNTS_QUERY = gql`
query getAvailableInstagramAccounts {
    getAvailableInstagramAccounts {
        id
        username
        profilePicture
    }
  }
`;

export interface GetAvailableInstagramAccountsQueryData {
    getAvailableInstagramAccounts: {
        id: string,
        username: string,
        profilePicture: string
    }[];
}