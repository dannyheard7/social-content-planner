import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { PostMediaItem } from './PostMediaItem.entity';
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

  @Column({ nullable: false, name: "created_at" })
  @Field(type => Date)
  createdAt?: Date;

  @Column({ nullable: false, name: "updated_at" })
  @Field(type => Date)
  updatedAt: Date;

  @OneToMany(
    type => PostMediaItem,
    postImage => postImage.post,
  )
  @JoinTable()
  media: Promise<PostMediaItem[]>;

  @OneToMany(
    type => PostPlatform,
    postNetwork => postNetwork.post,
  )
  @JoinTable()
  platforms: Promise<PostPlatform[]>;
}
