import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Post } from './Post.entity';
import { PostInput } from './PostInput';
import { PostImage } from './PostImage.entity';
import * as uuid from 'uuid/v4';
import { PostNetwork } from './PostNetwork.entity';

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

    const images = postInput.images.map(image => {
      const postImage = new PostImage();
      postImage.image_id = image;
      postImage.post_id = post.id;
      return postImage;
    });

    const networks = postInput.networks.map(network => {
      const postNetwork = new PostNetwork();
      postNetwork.network = network;
      postNetwork.post_id = post.id;
      return postNetwork;
    });

    const entities = await this.connection.manager.save([
      ...images,
      ...networks,
      post,
    ]);

    return entities.find(e => e instanceof Post) as Post;
  }
}
