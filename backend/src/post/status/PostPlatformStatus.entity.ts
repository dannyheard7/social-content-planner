import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PostPlatform } from '../PostPlatform.entity';
import { Post } from '../Post.entity';

export interface CustomStatusData {
    name: string;
    description: string;
    value: string;
    datatype: "integer"
}

@Entity('post_platform_status')
@ObjectType('PostPlatformStatus')
export class PostPlatformStatus {
    @PrimaryColumn({ nullable: false })
    @Field(type => ID)
    id: string;

    @Column({ nullable: false, name: "post_id" })
    @Field(type => ID)
    postId: string;

    @Column({ nullable: false, name: "post_platform_id" })
    @Field(type => ID)
    postPlatformId: string;

    @Column({ nullable: false })
    @Field(type => Date)
    timestamp: Date;

    @Column({ nullable: false, name: "positive_reactions_count" })
    @Field(type => Int)
    positiveReactionsCount: number;

    @Column({ nullable: true, name: "negative_reactions_count" })
    @Field(type => Int)
    negativeReactionsCount?: number;

    @Column({ nullable: false, name: "comments_count" })
    @Field(type => Int)
    commentsCount: number;

    @Column({ nullable: false, name: "shares_count" })
    @Field(type => Int)
    sharesCount: number;

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: true,
        name: "custom_data"
    })
    customData?: CustomStatusData[];

    @ManyToOne(
        type => PostPlatform,
        postPlatform => postPlatform.id,
    )
    @JoinColumn({ name: 'post_platform_id' })
    postPlatform: Promise<PostPlatform>;

    @ManyToOne(
        type => Post,
        post => post.id,
    )
    @JoinColumn({ name: 'post_id' })
    post: Post;
}