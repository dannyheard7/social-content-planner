import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FileEntity } from '../file/file.entity';
import { Post } from './Post.entity';

@Entity('post_image')
@ObjectType('PostImage')
export class PostImage {
  @PrimaryColumn({ nullable: false })
  @Field(type => ID)
  post_id: string;

  @PrimaryColumn({ nullable: false })
  @Field(type => ID)
  image_id: string;

  @ManyToOne(
    type => FileEntity,
    file => file.id,
  )
  @JoinColumn({ name: 'image_id' })
  image: FileEntity;

  @ManyToOne(
    type => Post,
    post => post.id,
  )
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
