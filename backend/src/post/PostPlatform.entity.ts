import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Post } from './Post.entity';
import { PlatformConnection } from '../platform/PlatformConnection.entity';

@Entity('post_platform_connection')
@ObjectType('PostPlatform')
export class PostPlatform {
  @PrimaryColumn({ nullable: false })
  @Field(type => ID)
  post_id: string;

  @PrimaryColumn({ nullable: false })
  @Field(type => ID)
  platform_connection_id: string;

  @ManyToOne(
    type => PlatformConnection,
    platformConnection => platformConnection.id,
  )
  @JoinColumn({ name: 'platform_connection_id' })
  platformConnection: Promise<PlatformConnection>;

  @ManyToOne(
    type => Post,
    post => post.id,
  )
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
