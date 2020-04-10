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
import { PostPlatformStatus, CustomStatusData } from '../post/status/PostPlatformStatus.entity';

@Injectable()
export class InstagramService implements PlatformService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    async publishPost(
        text: string,
        media: FileEntity[],
        postPlatform: PostPlatform,
    ): Promise<PostPlatform> {
        throw new Error();
    }

    async getPostStatus(
        postPlatform: PostPlatform,
    ): Promise<PostPlatformStatus> {
        throw new Error();
    }
}
