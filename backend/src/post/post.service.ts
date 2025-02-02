import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import * as uuid from 'uuid/v4';
import { PlatformConnectionService } from '../platform/platform-connection.service';
import { Post } from './Post.entity';
import { PostInput } from './PostInput';
import { PostMediaItem } from './PostMediaItem.entity';
import { PostPlatform } from './PostPlatform.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(PostPlatform)
        private readonly postPlatformRepository: Repository<PostPlatform>,
        private readonly connection: Connection,
        private readonly platformConnectionService: PlatformConnectionService
    ) { }

    findById = (id: string) => this.postRepository.findOne({ id });
    findByIdAndUser = (id: string, user: User) => this.postRepository.findOne({ id, userId: user.sub });

    getAllForUser(user: User) {
        return this.postRepository.find({
            where: { userId: user.sub },
            order: {
                createdAt: "DESC"
            }
        });
    }

    async create(postInput: PostInput, user: User): Promise<Post> {
        const post = new Post();
        post.id = uuid();
        post.text = postInput.text;
        post.userId = user.sub;

        const images = postInput.images.map(image => {
            const postImage = new PostMediaItem();
            postImage.fileId = image;
            postImage.postId = post.id;
            return postImage;
        });

        const platformConnections = await this.platformConnectionService.getByIds(postInput.platformConnections);

        const platforms = platformConnections.map(pf => {
            const postPlatform = new PostPlatform();
            postPlatform.platformConnectionId = pf.id;
            postPlatform.postId = post.id;
            postPlatform.platform = pf.platform
            return postPlatform;
        });

        const entities = await this.connection.manager.save([
            ...images,
            ...platforms,
            post,
        ]);

        return entities.find(e => e instanceof Post) as Post;
    }

    savePostPlatforms = (postPlatforms: PostPlatform[]) => this.postPlatformRepository.save(postPlatforms);

    async getPostImageFiles(post: Post) {
        if ((await post.media).length > 0)
            return await Promise.all((await post.media).map(postImage => postImage.image));

        return [];
    }
}
