import { Module } from '@nestjs/common';
import { PlatformResolver } from './platform.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformConnection } from './PlatformConnection.entity';
import { PublisherService } from './publisher.service';
import { PlatformConnectionService } from './platformConnection.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformConnection])],
  providers: [PlatformResolver, PublisherService, PlatformConnectionService],
  exports: [PublisherService],
})
export class PlatformModule {}
