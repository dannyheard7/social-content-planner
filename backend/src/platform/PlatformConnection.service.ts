import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddPlatformConnectionInput } from './AddPlatformConnectionInput';
import { PlatformConnection } from './PlatformConnection.entity';
import Platform from './Platform';
import { FacebookService } from './Facebook.service';

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

    async getByNetworkForUser(
        network: string,
        user: User,
    ): Promise<PlatformConnection> {
        return await this.platformConnectionRepository.findOne({
            userId: user.sub,
            network,
        });
    }

    async create(
        platformConnectionInput: AddPlatformConnectionInput,
        user: User,
    ): Promise<PlatformConnection> {
        const platformConnection = new PlatformConnection();
        platformConnection.entityId = platformConnectionInput.entityId;

        // TODO: FB has non-expiring tokens for pages, but this won't be the same for twitter etc. refresh mechanism
        if (platformConnectionInput.platform === Platform.Facebook) {
            platformConnection.accessToken = await this.facebookService.getFacebookPageAccessToken(
                platformConnectionInput.platformUserId,
                platformConnectionInput.accessToken,
                platformConnectionInput.entityId,
            );
        } else platformConnection.accessToken = platformConnectionInput.accessToken;
        platformConnection.userId = user.sub;
        platformConnection.network = platformConnectionInput.platform;

        return await this.platformConnectionRepository.save(platformConnection);
    }
}
