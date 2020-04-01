import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FileEntity } from '../file/file.entity';
import { Post } from './Post.entity';

@Entity('post_media')
@ObjectType('PostMedia')
export class PostMediaItem {
  @PrimaryColumn({ nullable: false, name: "post_id" })
  @Field(type => ID)
  postId: string;

  @PrimaryColumn({ nullable: false, name: "file_id" })
  @Field(type => ID)
  fileId: string;

  @ManyToOne(
    type => FileEntity,
    file => file.id,
  )
  @JoinColumn({ name: 'file_id' })
  image: Promise<FileEntity>;

  @ManyToOne(
    type => Post,
    post => post.id,
  )
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
