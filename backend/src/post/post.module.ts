import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from './PostImage.entity';
import { Post } from './Post.entity';
import { PostNetwork } from './PostNetwork.entity';
import { PublisherModule } from '../publisher/publisher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostNetwork, PostImage]),
    PublisherModule,
  ],
  providers: [PostResolver, PostService],
})
export class PostModule {}
