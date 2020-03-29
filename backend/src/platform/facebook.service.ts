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

    private async getFacebookPageAccessToken(
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
        platformConnection.accessToken = await this.getFacebookPageAccessToken(
            platformConnectionInput.platformUserId,
            platformConnectionInput.accessToken,
            platformConnectionInput.entityId,
        );

        return platformConnection;
    }
}
