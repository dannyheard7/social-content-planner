import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oauth from 'oauth';
import { Post } from '../post/Post.entity';
import { PlatformConnection } from './PlatformConnection.entity';
import PlatformService from './PlatformService';
import { OAuthTokenResult } from './OAuthTokenResult.entity';
import Platform from './Platform';

@Injectable()
export class TwitterService implements PlatformService {
    constructor(private readonly configService: ConfigService) { }

    async publishPost(
        post: Post,
        platformConnection: PlatformConnection,
    ): Promise<string> {
        return "";
    }

    private createOAuthConsumer(callbackUrl?: string) {
        return new oauth.OAuth(
            "https://twitter.com/oauth/request_token",
            "https://twitter.com/oauth/access_token",
            this.configService.get("TWITTER_CONSUMER_KEY"),
            this.configService.get("TWITTER_CONSUMER_SECRET"),
            "1.0A",
            callbackUrl,
            "HMAC-SHA1");
    }

    async getOAuthRequestToken(callbackUrl: string): Promise<OAuthTokenResult> {
        var consumer = this.createOAuthConsumer(callbackUrl)

        const data = await new Promise<OAuthTokenResult>((resolve, reject) => {
            consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
                if (error) reject(error);
                else resolve({ oauthToken, oauthTokenSecret })
            });
        });

        return data;
    }

    async getOAuthAccessToken(
        requestToken: string,
        requestTokenSecret: string,
        oauthVerifier: string
    ): Promise<OAuthTokenResult> {
        var consumer = this.createOAuthConsumer(null);

        const data = await new Promise<OAuthTokenResult>((resolve, reject) => {
            consumer.getOAuthAccessToken(requestToken, requestTokenSecret, oauthVerifier, (error, oauthToken, oauthTokenSecret, results) => {
                if (error) reject(error);
                else resolve({ oauthToken, oauthTokenSecret })
            });
        });

        return data;
    }

    async createPlatformConnection(result: OAuthTokenResult): Promise<PlatformConnection> {
        var consumer = this.createOAuthConsumer(null);

        return await new Promise<PlatformConnection>((resolve, reject) => {
            consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", result.oauthToken, result.oauthTokenSecret, function (error, data, response) {
                if (error) reject(error);
                else {
                    const json = JSON.parse(data);
                    const platformConnection = new PlatformConnection();
                    platformConnection.entityId = json.id;
                    platformConnection.platform = Platform.TWITTER;;
                    platformConnection.entityName = json.screen_name;
                    platformConnection.accessToken = result.oauthToken;
                    platformConnection.accessTokenSecret = result.oauthTokenSecret;
                    resolve(platformConnection);
                }
            });
        });
    }
}
