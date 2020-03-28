import { Module } from '@nestjs/common';
import { PlatformResolver } from './platform.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformConnection } from './PlatformConnection.entity';
import { PublisherService } from './publisher.service';
import { PlatformConnectionService } from './platform-connection.service';
import { FacebookService } from './facebook.service';
import { TwitterService } from './twitter.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformConnection])],
  providers: [
    PlatformResolver,
    PublisherService,
    PlatformConnectionService,
    FacebookService,
    TwitterService
  ],
  exports: [PublisherService],
})
export class PlatformModule { }
