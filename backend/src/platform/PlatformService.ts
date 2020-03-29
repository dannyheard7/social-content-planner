import { PostPlatform } from '../post/PostPlatform.entity';
import { FileEntity } from '../file/file.entity';

export default interface PlatformService {
    publishPost(
        text: string,
        media: FileEntity[],
        postPlatform: PostPlatform
    ): Promise<PostPlatform>;
}

