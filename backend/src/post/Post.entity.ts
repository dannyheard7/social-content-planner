import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
} from 'typeorm';
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

  @Column({ nullable: false })
  @Field(type => ID)
  user_id: string;

  @OneToMany(
    type => PostImage,
    postImage => postImage.post,
  )
  @JoinTable()
  images: Promise<PostImage[]>;

  @OneToMany(
    type => PostNetwork,
    postNetwork => postNetwork.post,
  )
  @JoinTable()
  networks: PostNetwork[];
}
