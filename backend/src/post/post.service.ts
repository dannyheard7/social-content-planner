import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import * as uuid from 'uuid/v4';
import { Post } from './Post.entity';
import { PostMediaItem } from './PostMediaItem.entity';
import { PostInput } from './PostInput';
import { PostPlatform } from './PostPlatform.entity';
import { FileEntity } from '../file/file.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(PostPlatform)
        private readonly postPlatformRepository: Repository<PostPlatform>,
        private readonly connection: Connection,
    ) { }

    findById(id: string): Promise<Post | undefined> {
        return this.postRepository.findOne({ id });
    }

    findByIdAndUser(id: string, user: User): Promise<Post | undefined> {
        return this.postRepository.findOne({ id, userId: user.sub });
    }

    async getAllForUser(user: User): Promise<Post[]> {
        return await this.postRepository.find({
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

        const platforms = postInput.platformConnections.map(pf => {
            const postPlatform = new PostPlatform();
            postPlatform.platformConnectionId = pf;
            postPlatform.postId = post.id;
            return postPlatform;
        });

        const entities = await this.connection.manager.save([
            ...images,
            ...platforms,
            post,
        ]);

        return entities.find(e => e instanceof Post) as Post;
    }

    async updatePostPlatforms(postPlatforms: PostPlatform[]): Promise<PostPlatform[]> {
        return await this.postPlatformRepository.save(postPlatforms);
    }

    async getPostImageFiles(post: Post): Promise<FileEntity[]> {
        if ((await post.media).length > 0)
            return await Promise.all((await post.media).map(postImage => postImage.image));

        return [];
    }
}
