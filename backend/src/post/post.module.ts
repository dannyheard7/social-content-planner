import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { FilesController } from './post.controller';

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [PostResolver],
})
export class PostModule {}
