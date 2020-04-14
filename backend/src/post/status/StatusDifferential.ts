import { Field, Int, ObjectType, Float } from '@nestjs/graphql';

@ObjectType('StatusDifferential')
export class StatusDifferential {
    constructor(positiveReactionsDiff: number,
        negativeReactionsDiff: number, commentsCountDiff: number,
        sharesCountDiff: number) {
        this.positiveReactionsDiff = positiveReactionsDiff;
        this.negativeReactionsDiff = negativeReactionsDiff;
        this.commentsCountDiff = commentsCountDiff;
        this.sharesCountDiff = sharesCountDiff;

        this.overallDiff = (positiveReactionsDiff + negativeReactionsDiff + commentsCountDiff + sharesCountDiff) / 4;
    }

    @Field(type => Float)
    overallDiff: number;

    @Field(type => Float)
    positiveReactionsDiff: number;

    @Field(type => Float)
    negativeReactionsDiff: number;

    @Field(type => Float)
    commentsCountDiff: number;

    @Field(type => Float)
    sharesCountDiff: number;
}