import gql from "graphql-tag";

export const CREATE_PLATFORM_OAUTH_TOKEN = gql`
mutation CreatePlatformOAuthToken($platform: Platform!, $callbackUrl: String!) {
    createPlatformOAuthToken(platform: $platform, callbackUrl: $callbackUrl) {
        oauthToken
        oauthTokenSecret
    }
  }
`;

export interface CreatePlatformOAuthTokenMutationVars {
    platform: string;
    callbackUrl: string;
}

export interface CreatePlatformOAuthTokenMutationData {
    createPlatformOAuthToken: {
        oauthToken: string;
        oauthTokenSecret: string
    };
}