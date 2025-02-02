import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import * as fs from 'fs';
import fetch from 'node-fetch';
import * as oauth from 'oauth';
import * as path from 'path';
import { FileEntity } from '../file/file.entity';
import { PostPlatform } from '../post/PostPlatform.entity';
import { OAuthTokenResult } from './OAuthTokenResult.entity';
import Platform from './Platform';
import { PlatformConnection } from './PlatformConnection.entity';
import PlatformService from './PlatformService';
import { PostPlatformStatus } from '../post/status/PostPlatformStatus.entity';

@Injectable()
export class TwitterService implements PlatformService {
    constructor(
        private readonly configService: ConfigService
    ) { }

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

    // This is only for videos. Unused for now but use again when we enable video uploading
    private async checkMediaStatus(mediaCheckUrl: string, authHeader: string, mediaId: string, resolve: () => void, reject: () => void) {
        const result = await fetch(
            mediaCheckUrl,
            {
                headers: {
                    'Authorization': authHeader
                }
            }
        )
            .then(response => response.json())
            .catch(e => { throw new Error(e) });

        if (result.processing_info.state === "succeeded") resolve();
        else if (result.processing_info.state === "failed") reject();
        else setTimeout(() => this.checkMediaStatus(mediaCheckUrl, authHeader, mediaId, resolve, reject), 1000);
    }

    private async waitForMedia(mediaIds: string[], platformConnection: PlatformConnection) {
        const consumer = this.createOAuthConsumer();

        const waitForMedia = mediaIds.map(mediaId => {
            const mediaCheckUrl = `https://upload.twitter.com/1.1/media/upload.json?command=STATUS&media_id=${mediaId}`;
            const auth = consumer.authHeader(mediaCheckUrl, platformConnection.accessToken, platformConnection.accessTokenSecret, 'GET');
            return new Promise((resolve, reject) => this.checkMediaStatus(mediaCheckUrl, auth, mediaId, resolve, reject));
        })

        await Promise.all(waitForMedia);
    }

    private async uploadMedia(media: FileEntity[], platformConnection: PlatformConnection) {
        const consumer = this.createOAuthConsumer();

        if (media.length > 0) {
            const url = 'https://upload.twitter.com/1.1/media/upload.json';
            const authorization = consumer.authHeader(url, platformConnection.accessToken, platformConnection.accessTokenSecret, 'POST');

            const imageUploadRequests = media.map(imageFile => {
                const data = new FormData();
                data.append('media', fs.createReadStream(path.join(this.configService.get("FILE_DIR"), imageFile.getLargeSizeFilename())));

                return fetch(
                    url,
                    {
                        method: 'POST',
                        body: data,
                        headers: {
                            'Authorization': authorization
                        }
                    }
                )
                    .then(response => response.json())
                    .catch(e => {
                        throw new Error(e.message);
                    });
            });
            return (await Promise.all(imageUploadRequests)).map(res => res.media_id_string);
        }
        return [];
    }

    async publishPost(
        postText: string,
        postMedia: FileEntity[],
        postPlatform: PostPlatform,
    ): Promise<PostPlatform> {
        const platformConnection = await postPlatform.platformConnection;
        const consumer = this.createOAuthConsumer();
        const mediaIds = (await this.uploadMedia(postMedia, platformConnection)).join(",");

        const url = `https://api.twitter.com/1.1/statuses/update.json?media_ids=${mediaIds}&status=${encodeURI(postText)}`;
        const res = await fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Authorization': consumer.authHeader(url, platformConnection.accessToken, platformConnection.accessTokenSecret, 'POST')
                }
            }
        )
            .then(response => response.json())
            .catch(e => {
                throw new Error(e.message);
            });

        postPlatform.platformEntityId = res.id_str;
        postPlatform.platformEntityUrl = `https://twitter.com/${res.user.screen_name}/status/${res.id_str}`;

        return postPlatform;
    }

    async getOAuthRequestToken(callbackUrl: string): Promise<OAuthTokenResult> {
        var consumer = this.createOAuthConsumer(callbackUrl)

        const data = await new Promise<OAuthTokenResult>((resolve, reject) => {
            consumer.getOAuthRequestToken((error, oauthToken, oauthTokenSecret, results) => {
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
        var consumer = this.createOAuthConsumer();

        const data = await new Promise<OAuthTokenResult>((resolve, reject) => {
            consumer.getOAuthAccessToken(requestToken, requestTokenSecret, oauthVerifier, (error, oauthToken, oauthTokenSecret, results) => {
                if (error) reject(error);
                else resolve({ oauthToken, oauthTokenSecret })
            });
        });

        return data;
    }

    async createPlatformConnection(result: OAuthTokenResult): Promise<PlatformConnection> {
        var consumer = this.createOAuthConsumer();

        return await new Promise<PlatformConnection>((resolve, reject) => {
            consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", result.oauthToken, result.oauthTokenSecret, (error, data, response) => {
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

    async getPostStatus(postPlatform: PostPlatform): Promise<PostPlatformStatus> {
        const platformConnection = await postPlatform.platformConnection;
        const consumer = this.createOAuthConsumer();

        const url = `https://api.twitter.com/labs/1/tweets/metrics/private?ids=${postPlatform.platformEntityId}`;
        const data = await fetch(
            url,
            {
                method: 'GET',
                headers: {
                    'Authorization': consumer.authHeader(url, platformConnection.accessToken, platformConnection.accessTokenSecret, 'GET')
                }
            }
        )
            .then(response => response.json())
            .catch(e => {
                throw new Error(e.message);
            });

        const status = new PostPlatformStatus();
        status.postId = postPlatform.postId;
        status.postPlatformId = postPlatform.id;
        status.positiveReactionsCount = data.data[0].tweet.like_count
        status.negativeReactionsCount = 0; // Don't need to do this for twitter
        status.commentsCount = data.data[0].tweet.reply_count;
        status.sharesCount = data.data[0].tweet.retweet_count + data.data[0].tweet.quote_count;

        return status;
    }
}