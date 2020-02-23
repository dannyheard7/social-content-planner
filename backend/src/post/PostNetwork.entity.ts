import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Post } from './Post.entity';

@Entity('post_network')
@ObjectType('PostNetwork')
export class PostNetwork {
  @PrimaryColumn({ nullable: false })
  @Field(type => ID)
  post_id: string;

  @PrimaryColumn({ nullable: false })
  @Field(type => String)
  network: string; // TODO: this will be its own table

  @ManyToOne(
    type => Post,
    post => post.id,
  )
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
