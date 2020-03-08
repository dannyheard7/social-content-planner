import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import * as uuid from 'uuid/v4';
import { Post } from './Post.entity';
import { PostImage } from './PostImage.entity';
import { PostInput } from './PostInput';
import { PostPlatform } from './PostPlatform.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly connection: Connection,
  ) {}
  findById(id: string): Promise<Post | undefined> {
    return this.postRepository.findOne(id);
  }

  async create(postInput: PostInput): Promise<Post> {
    const post = new Post();
    post.id = uuid();
    post.text = postInput.text;

    const images = postInput.images.map(image => {
      const postImage = new PostImage();
      postImage.image_id = image;
      postImage.post_id = post.id;
      return postImage;
    });

    const platforms = postInput.platformConnections.map(pf => {
      const postPlatform = new PostPlatform();
      postPlatform.platform_connection_id = pf;
      postPlatform.post_id = post.id;
      return postPlatform;
    });

    const entities = await this.connection.manager.save([
      ...images,
      ...platforms,
      post,
    ]);

    return entities.find(e => e instanceof Post) as Post;
  }
}
