import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('AggregatedStatus')
export class AggregatedStatus {

    constructor(timestamp: Date, positiveReactionsCount: number,
        negativeReactionsCount: number, commentsCount: number,
        sharesCount: number) {
        this.timestamp = timestamp;
        this.positiveReactionsCount = positiveReactionsCount;
        this.negativeReactionsCount = negativeReactionsCount;
        this.commentsCount = commentsCount;
        this.sharesCount = sharesCount;
    }

    @Field(type => Date)
    timestamp: Date;

    @Field(type => Int)
    positiveReactionsCount: number;

    @Field(type => Int)
    negativeReactionsCount?: number;

    @Field(type => Int)
    commentsCount: number;

    @Field(type => Int)
    sharesCount: number;
}