import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { PostMedia } from './PostImage.entity';
import { PostPlatform } from './PostPlatform.entity';

@Entity('post')
@ObjectType('Post')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  id: string;

  @Column()
  @Field(type => String)
  text: string;

  @Column({ nullable: false, name: "user_id" })
  @Field(type => ID)
  userId: string;

  @OneToMany(
    type => PostMedia,
    postImage => postImage.post,
  )
  @JoinTable()
  media: Promise<PostMedia[]>;

  @OneToMany(
    type => PostPlatform,
    postNetwork => postNetwork.post,
  )
  @JoinTable()
  platforms: Promise<PostPlatform[]>;
}
