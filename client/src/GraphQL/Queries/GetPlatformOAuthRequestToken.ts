import { gql } from '@apollo/client';

export const GET_PLATFORM_OAUTH_REQUEST_TOKEN = gql`
query CreatePlatformOAuthToken($platform: Platform!, $callbackUrl: String!) {
    getPlatformOAuthRequestToken(platform: $platform, callbackUrl: $callbackUrl) {
        oauthToken
        oauthTokenSecret
    }
  }
`;

export interface GetPlatformOAuthRequestTokenQueryVars {
    platform: string;
    callbackUrl: string;
}

export interface GetPlatformOAuthRequestTokenQueryData {
    getPlatformOAuthRequestToken: {
        oauthToken: string;
        oauthTokenSecret: string
    };
}