import { Module } from '@nestjs/common';
import { PlatformResolver } from './platform.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformConnection } from './PlatformConnection.entity';
import { PublisherService } from './Publisher.service';
import { PlatformConnectionService } from './PlatformConnection.service';
import { FacebookService } from './Facebook.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformConnection])],
  providers: [
    PlatformResolver,
    PublisherService,
    PlatformConnectionService,
    FacebookService,
  ],
  exports: [PublisherService],
})
export class PlatformModule { }
