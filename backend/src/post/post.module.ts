import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from './PostImage.entity';
import { Post } from './Post.entity';
import { PostNetwork } from './PostNetwork.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostNetwork, PostImage])],
  providers: [PostResolver, PostService],
})
export class PostModule {}
