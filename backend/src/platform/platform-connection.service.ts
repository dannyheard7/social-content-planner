import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddPlatformConnectionInput } from './AddPlatformConnectionInput';
import { FacebookService } from './facebook.service';
import { OAuthTokenResult } from './OAuthTokenResult.entity';
import Platform from './Platform';
import { PlatformConnection } from './PlatformConnection.entity';
import { TwitterService } from './twitter.service';

@Injectable()
export class PlatformConnectionService {
    constructor(
        @InjectRepository(PlatformConnection)
        private readonly platformConnectionRepository: Repository<
            PlatformConnection
        >,
        private readonly facebookService: FacebookService,
        private readonly twitterService: TwitterService
    ) { }

    getByIds = (ids: string[]) => this.platformConnectionRepository.createQueryBuilder().andWhereInIds(ids).getMany();
    findByIdAndUser = (id: string, user: User) => this.platformConnectionRepository.findOne({ id, userId: user.sub });

    async getAllForUser(user: User): Promise<PlatformConnection[]> {
        return await this.platformConnectionRepository.find({
            userId: user.sub,
        });
    }

    async getOAuthRequestToken(platform: Platform, callbackUrl: string): Promise<OAuthTokenResult> {
        switch (platform) {
            case Platform.TWITTER:
                return this.twitterService.getOAuthRequestToken(callbackUrl);
            default:
                throw new Error("Platform not currently supported");
        }
    }

    async getOAuthAccessToken(platform: Platform, oauthToken: string, oauthTokenSecret: string, oauthVerifier: string): Promise<OAuthTokenResult> {
        switch (platform) {
            case Platform.TWITTER:
                return this.twitterService.getOAuthAccessToken(oauthToken, oauthTokenSecret, oauthVerifier);
            default:
                throw new Error("Platform not currently supported");
        }
    }

    async create(
        user: User,
        platform: Platform,
        platformConnectionInput?: AddPlatformConnectionInput,
        oauthTokenResult?: OAuthTokenResult
    ): Promise<PlatformConnection> {
        var platformConnection: PlatformConnection;

        switch (platform) {
            case Platform.FACEBOOK:
                platformConnection = await this.facebookService.createPlatformConnection(platformConnectionInput!);
                break;
            case Platform.TWITTER:
                platformConnection = await this.twitterService.createPlatformConnection(oauthTokenResult!);
                break;
            default:
                throw new Error("Platform not currently supported");
        }
        platformConnection.userId = user.sub;

        if (await this.platformConnectionRepository.findOne({
            userId: platformConnection.userId,
            entityId: platformConnection.entityId,
            platform: platformConnection.platform
        })) throw new Error("This platform connection already exists");

        return await this.platformConnectionRepository.save(platformConnection);
    }

    async delete(platformConnection: PlatformConnection): Promise<string> {
        await this.platformConnectionRepository.delete({ id: platformConnection.id });
        return platformConnection.id;
    }
}
