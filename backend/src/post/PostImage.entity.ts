import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FileEntity } from '../file/file.entity';
import { Post } from './Post.entity';

@Entity('post_media')
@ObjectType('PostMedia')
export class PostMedia {
  @PrimaryColumn({ nullable: false })
  @Field(type => ID)
  post_id: string;

  @PrimaryColumn({ nullable: false })
  @Field(type => ID)
  file_id: string;

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
