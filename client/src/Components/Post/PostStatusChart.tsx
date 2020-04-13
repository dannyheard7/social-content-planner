import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PostStatus } from '../../Common/Interfaces/PostStatus';

const PostStatusChart: React.FC<{ statuses: PostStatus[] }> = ({ statuses }) => {
    const dateFormatter = new Intl.DateTimeFormat('default', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric'
    });
    const formatXAxis = (tickItem: string) => dateFormatter.format(new Date(tickItem));

    const getDomain = (): [number, number] => [statuses[statuses.length - 1].timestamp, statuses[0].timestamp]

    return (
        <Grid container >
            <Grid item sm={12} md={12}>
                {statuses.length > 0 ?
                    <ResponsiveContainer width="99%" height={300}>
                        <ComposedChart data={statuses} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="timestamp" tickFormatter={formatXAxis} domain={getDomain()} scale="time" type="number" />
                            <YAxis />
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <Line dataKey="positiveReactionsCount" name="Positive Reactions" stroke="#003f5c" dot={true} />
                            <Line dataKey="negativeReactionsCount" name="Negative Reactions" stroke="#ff6361" dot={true} />
                            <Line dataKey="sharesCount" name="Shares" stroke="#58508d" dot={true} />
                            <Line dataKey="commentsCount" name="Comments" stroke="#bc5090" dot={true} />
                            <Tooltip labelFormatter={(value) => formatXAxis(value as string)} />
                        </ComposedChart >
                    </ResponsiveContainer>
                    :
                    <Typography>This post has no stats yet (Check again later)</Typography>
                }
            </Grid>
        </Grid>
    );
};

export default PostStatusChart;
