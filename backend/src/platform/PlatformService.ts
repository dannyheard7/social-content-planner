import { PlatformConnection } from './PlatformConnection.entity';
import { Post } from '../post/Post.entity';

export default interface PlatformService {
    publishPost(
        post: Post,
        platformConnection: PlatformConnection,
    ): Promise<string>;
}

