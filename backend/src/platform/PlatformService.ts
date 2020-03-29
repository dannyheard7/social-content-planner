import { Post } from '../post/Post.entity';
import { PostPlatform } from '../post/PostPlatform.entity';

export default interface PlatformService {
    publishPost(
        post: Post,
        postPlatform: PostPlatform
    ): Promise<PostPlatform>;
}

