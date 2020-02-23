import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PostImage } from './PostImage.entity';
import { PostNetwork } from './PostNetwork.entity';

@Entity('post')
@ObjectType('Post')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  id: string;

  @Column()
  @Field(type => String)
  text: string;

  @OneToMany(
    type => PostImage,
    postImage => postImage.post_id,
  )
  images: PostImage[];

  @OneToMany(
    type => PostNetwork,
    postNetwork => postNetwork.post_id,
  )
  networks: PostNetwork[];
}
