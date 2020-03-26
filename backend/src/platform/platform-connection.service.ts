import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as oauth from 'oauth';
import { Repository } from 'typeorm';
import { AddPlatformConnectionInput } from './AddPlatformConnectionInput';
import { FacebookService } from './facebook.service';
import Platform from './Platform';
import { PlatformConnection } from './PlatformConnection.entity';
import { TwitterOAuthResult } from './TwitterOAuthResult.entity';

@Injectable()
export class PlatformConnectionService {
    constructor(
        @InjectRepository(PlatformConnection)
        private readonly platformConnectionRepository: Repository<
            PlatformConnection
        >,
        private readonly facebookService: FacebookService,
        private readonly configService: ConfigService
    ) { }

    async getAllForUser(user: User): Promise<PlatformConnection[]> {
        return await this.platformConnectionRepository.find({
            userId: user.sub,
        });
    }

    async getPlatformOAuthToken(platform: Platform, callbackUrl: string): Promise<TwitterOAuthResult> {
        if (platform === Platform.TWITTER) {
            var consumer = new oauth.OAuth(
                "https://twitter.com/oauth/request_token",
                "https://twitter.com/oauth/access_token",
                this.configService.get("TWITTER_CONSUMER_KEY"),
                this.configService.get("TWITTER_CONSUMER_SECRET"),
                "1.0A",
                callbackUrl,
                "HMAC-SHA1");

            const data = await new Promise<TwitterOAuthResult>((resolve, reject) => {
                consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
                    if (error) reject(error);
                    else resolve({ oauthToken, oauthTokenSecret })
                });
            })

            return data;
        }
        throw new Error("Platform not currently supported");
    }

    async create(
        platformConnectionInput: AddPlatformConnectionInput,
        user: User,
    ): Promise<PlatformConnection> {
        const platformConnection = new PlatformConnection();
        platformConnection.entityId = platformConnectionInput.entityId;
        platformConnection.platform = platformConnectionInput.platform;
        platformConnection.entityName = platformConnectionInput.entityName;
        platformConnection.userId = user.sub;

        if (platformConnectionInput.platform === Platform.FACEBOOK) {
            //Facebook has non expiring tokens for pages
            platformConnection.accessToken = await this.facebookService.getFacebookPageAccessToken(
                platformConnectionInput.platformUserId,
                platformConnectionInput.accessToken,
                platformConnectionInput.entityId,
            );
        } else platformConnection.accessToken = platformConnectionInput.accessToken;

        return await this.platformConnectionRepository.save(platformConnection);
    }
}
