import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import * as fs from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';
import { FileEntity } from '../file/file.entity';
import { PostPlatform } from '../post/PostPlatform.entity';
import { AddPlatformConnectionInput } from './AddPlatformConnectionInput';
import Platform from './Platform';
import { PlatformConnection } from './PlatformConnection.entity';
import PlatformService from './PlatformService';
import { PostPlatformStatus, CustomStatusData } from '../post/status/PostPlatformStatus.entity';
import { FacebookPageInstagramAccount } from './InstagramUser';

@Injectable()
export class FacebookService implements PlatformService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    private async uploadMedia(media: FileEntity[], platformConnection: PlatformConnection) {
        if (media.length > 0) {
            const imageUploadRequests = media.map(imageFile => {
                const data = new FormData();
                data.append('file', fs.createReadStream(path.join(this.configService.get("FILE_DIR"), imageFile.filename)));

                return fetch(
                    `https://graph.facebook.com/v6.0/${platformConnection.entityId}/photos?published=false&access_token=${platformConnection.accessToken}`,
                    { method: 'POST', body: data }
                )
                    .then(response => response.json())
                    .catch(e => {
                        throw new Error(e.message);
                    });
            });
            const data = await Promise.all(imageUploadRequests);
            return data.map(d => ({ media_fbid: d.id }));
        }
        return [];
    }

    async publishPost(
        text: string,
        media: FileEntity[],
        postPlatform: PostPlatform,
    ): Promise<PostPlatform> {
        const platformConnection = await postPlatform.platformConnection;
        const attachedMedia = await this.uploadMedia(media, platformConnection);

        const body = {
            access_token: platformConnection.accessToken,
            message: text,
            published: true,
            attached_media: attachedMedia,
        };

        const postData = await fetch(
            `https://graph.facebook.com/v6.0/${platformConnection.entityId}/feed`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            },
        )
            .then(res => res.json())
            .catch(e => {
                throw new Error(e.message);
            });

        postPlatform.platformEntityId = postData.id;
        postPlatform.platformEntityUrl = `https://facebook.com/permalink.php?story_fbid=${postPlatform.platformEntityId.split("_")[1]}&id=${platformConnection.entityId}`;

        return postPlatform;
    }

    private async getPageAccessToken(
        userId: string,
        userAccessToken: string,
        pageId: string,
    ): Promise<string> {
        const clientId = this.configService.get<string | undefined>(
            'FACEBOOK_APP_ID',
        );
        const clientSecret = this.configService.get<string | undefined>(
            'FACEBOOK_APP_SECRET',
        );

        if (!clientId || !clientSecret)
            throw new Error('Facebook app details not setup');

        const data = await fetch(
            `https://graph.facebook.com/v6.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${userAccessToken}`,
        )
            .then(response => response.json())
            .catch(e => {
                throw new Error(e.message);
            });

        const pages = await fetch(
            `https://graph.facebook.com/v6.0/${userId}/accounts?access_token=${data.access_token}&fields=access_token`,
        )
            .then(response => response.json())
            .catch(e => {
                throw new Error(e.message);
            });
        return pages.data.find(p => p.id === pageId).access_token;
    }

    async createPlatformConnection(platformConnectionInput: AddPlatformConnectionInput): Promise<PlatformConnection> {
        const platformConnection = new PlatformConnection();
        platformConnection.entityId = platformConnectionInput.entityId;
        platformConnection.platform = Platform.FACEBOOK;
        platformConnection.entityName = platformConnectionInput.entityName;
        platformConnection.accessToken = await this.getPageAccessToken(
            platformConnectionInput.platformUserId,
            platformConnectionInput.accessToken,
            platformConnectionInput.entityId,
        );

        return platformConnection;
    }

    async getPostStatus(
        postPlatform: PostPlatform,
    ): Promise<PostPlatformStatus> {
        const platformConnection = await postPlatform.platformConnection;

        const metrics = ["post_impressions_unique", "post_impressions_fan"];
        const fields = ["shares", "reactions.summary(true)", "comments.limit(1).summary(true)", `insights.metric(${metrics.join(",")})`].join(",");

        const postData = await fetch(
            `https://graph.facebook.com/v6.0/${postPlatform.platformEntityId}?fields=${fields}&access_token=${platformConnection.accessToken}`,

        )
            .then(res => res.json())
            .catch(e => {
                throw new Error(e.message);
            });

        const reactions = postData.reactions.data.reduce(({ positive, negative }, reaction) => {
            switch (reaction.type) {
                case "LIKE":
                case "LOVE":
                case "HAHA":
                case "WOW":
                    return { positive: positive + 1, negative };
                case "SAD":
                case "ANGRY":
                    return { positive, negative: negative + 1 };
                default:
                    return { positive, negative };
            }
        }, { positive: 0, negative: 0 });

        const status = new PostPlatformStatus();
        status.postId = postPlatform.postId;
        status.postPlatformId = postPlatform.id;
        status.positiveReactionsCount = reactions.positive;
        status.negativeReactionsCount = reactions.negative;
        status.commentsCount = postData.comments.summary.total_count;
        status.sharesCount = postData.shares?.count || 0;

        status.customData = postData.insights.data.reduce(
            (acc: CustomStatusData[], { name, description, values }): CustomStatusData[] => (
                [...acc,
                {
                    name,
                    description,
                    value: values[0].value,
                    datatype: "integer"
                }]
            ), []);

        return status;
    }

    async getPageLinkedInstagramAccounts(
        platformConnection: PlatformConnection
    ): Promise<FacebookPageInstagramAccount[]> {
        const fields = ["profile_pic", "username"].join(",");

        const data = await fetch(
            `https://graph.facebook.com/v6.0/${platformConnection.entityId}/instagram_accounts?fields=${fields}&access_token=${platformConnection.accessToken}`,
        )
            .then(response => response.json())
            .catch(e => {
                throw new Error(e.message);
            });

        return data.data.map((igUser) => new FacebookPageInstagramAccount(igUser.id, igUser.username, igUser.profile_pic));
    }
}
