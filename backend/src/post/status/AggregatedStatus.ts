import { Field, Int, ObjectType } from '@nestjs/graphql';
import { StatusDifferential } from './StatusDifferential';

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

    @Field()
    timestamp: Date;

    @Field(type => Int)
    positiveReactionsCount: number;

    @Field(type => Int)
    negativeReactionsCount?: number;

    @Field(type => Int)
    commentsCount: number;

    @Field(type => Int)
    sharesCount: number;

    private fractionalDiff = (v1: number, v2: number) => {
        if (v1 == 0 && v2 == 0) return 0;
        return (v1 - v2) / ((v1 + v2) / 2)
    }

    getDifferential = (other: AggregatedStatus) => {
        if (this.timestamp > other.timestamp) {
            return new StatusDifferential(
                this.fractionalDiff(this.positiveReactionsCount, other.positiveReactionsCount),
                this.fractionalDiff(this.negativeReactionsCount, other.negativeReactionsCount),
                this.fractionalDiff(this.commentsCount, other.commentsCount),
                this.fractionalDiff(this.sharesCount, other.sharesCount)
            )
        } else {
            return new StatusDifferential(
                this.fractionalDiff(other.positiveReactionsCount, this.positiveReactionsCount),
                this.fractionalDiff(other.negativeReactionsCount, this.negativeReactionsCount),
                this.fractionalDiff(other.commentsCount, this.commentsCount),
                this.fractionalDiff(other.sharesCount, this.sharesCount)
            )
        }

    }
}