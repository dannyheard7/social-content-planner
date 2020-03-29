import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Column } from 'typeorm';
import { Post } from './Post.entity';
import { PlatformConnection } from '../platform/PlatformConnection.entity';

@Entity('post_platform_connection')
@ObjectType('PostPlatform')
export class PostPlatform {
  @PrimaryColumn({ nullable: false, name: "post_id" })
  @Field(type => ID)
  postId: string;

  @PrimaryColumn({ nullable: false, name: "platform_connection_id" })
  @Field(type => ID)
  platformConnectionId: string;

  @Column({ nullable: true, name: "platform_entity_id" })
  platformEntityId?: string;

  @Column({ nullable: true, name: "platform_entity_url" })
  platformEntityUrl?: string;

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
