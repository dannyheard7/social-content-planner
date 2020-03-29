export default interface AddOAuthPlatformConnectionInput {
    oauthToken: string,
    oauthTokenSecret: string,
    oauthVerifier: string,
    platform: string
}