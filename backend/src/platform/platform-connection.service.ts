import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddPlatformConnectionInput } from './AddPlatformConnectionInput';
import { PlatformConnection } from './PlatformConnection.entity';
import Platform from './Platform';
import { FacebookService } from './facebook.service';

@Injectable()
export class PlatformConnectionService {
    constructor(
        @InjectRepository(PlatformConnection)
        private readonly platformConnectionRepository: Repository<
            PlatformConnection
        >,
        private readonly facebookService: FacebookService,
    ) { }

    async getAllForUser(user: User): Promise<PlatformConnection[]> {
        return await this.platformConnectionRepository.find({
            userId: user.sub,
        });
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
