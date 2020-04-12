import { Grid, Typography } from '@material-ui/core';
import { CommentOutlined as CommentIcon, SentimentDissatisfiedOutlined as NegativeReactionIcon, SentimentSatisfiedAlt as PositiveReactionIcon, ShareOutlined as ShareIcon } from '@material-ui/icons';
import React from 'react';
import { PostStatus } from '../../Common/Interfaces/PostStatus';

const StatusSummary: React.FC<{ status: PostStatus }> = ({ status }) => {
    return (
        <Grid container item md={12} spacing={2} alignContent="center">
            <Grid item>
                <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                >
                    <PositiveReactionIcon /> {status.positiveReactionsCount}
                </Typography>
            </Grid>
            <Grid item>
                <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                >
                    <NegativeReactionIcon /> {status.negativeReactionsCount}
                </Typography>
            </Grid>
            <Grid item>
                <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                >
                    <CommentIcon /> {status.commentsCount}
                </Typography>
            </Grid>
            <Grid item>
                <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                >
                    <ShareIcon /> {status.sharesCount}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default StatusSummary;
