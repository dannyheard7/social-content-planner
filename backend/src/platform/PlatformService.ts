import { PostPlatform } from '../post/PostPlatform.entity';
import { FileEntity } from '../file/file.entity';
import { PostPlatformStatus } from '../post/status/PostPlatformStatus.entity';

export default interface PlatformService {
    publishPost(
        text: string,
        media: FileEntity[],
        postPlatform: PostPlatform
    ): Promise<PostPlatform>;

    getPostStatus(
        postPlatform: PostPlatform,
    ): Promise<PostPlatformStatus>;
}

