import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacebookService } from './facebook.service';
import { PlatformConnectionService } from './platform-connection.service';
import { PlatformResolver } from './platform.resolver';
import { PlatformConnection } from './PlatformConnection.entity';
import { TwitterService } from './twitter.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformConnection])],
  providers: [
    PlatformResolver,
    PlatformConnectionService,
    FacebookService,
    TwitterService
  ],
  exports: [
    FacebookService,
    TwitterService,
    PlatformConnectionService
  ],
})
export class PlatformModule { }
