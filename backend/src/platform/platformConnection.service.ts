import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddPlatformConnectionInput } from './AddPlatformConnectionInput';
import { PlatformConnection } from './PlatformConnection.entity';

@Injectable()
export class PlatformConnectionService {
  constructor(
    @InjectRepository(PlatformConnection)
    private readonly platformConnectionRepository: Repository<
      PlatformConnection
    >,
  ) {}

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

    // FB has non-expiring tokens for pages, but this won't be the same for twitter etc.
    platformConnection.accessToken = platformConnectionInput.accessToken;
    platformConnection.userId = user.sub;

    return await this.platformConnectionRepository.save(platformConnection);
  }
}
