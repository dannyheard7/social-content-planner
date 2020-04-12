import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PostStatus } from '../../Common/Interfaces/PostStatus';


const PostStatusChart: React.FC<{ statuses: PostStatus[] }> = ({ statuses }) => {

    const dateFormatter = new Intl.DateTimeFormat('default', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric'
    });
    const formatXAxis = (tickItem: string) => dateFormatter.format(new Date(tickItem));
    const getDomain = (): [number, number] => [new Date(statuses[0].timestamp).getTime(), new Date(statuses[statuses.length - 1].timestamp).getTime()]

    return (
        <Grid container >
            <Grid item md={12}>
                {statuses.length > 0 ?
                    <ResponsiveContainer width="99%" height={300}>
                        <LineChart data={statuses} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} height={300} width={300}>
                            <XAxis dataKey="timestamp" tickFormatter={formatXAxis} domain={getDomain()} />
                            <YAxis />
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="positiveReactionsCount" name="Positive Reactions" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="negativeReactionsCount" name="Negative Reactions" stroke="#8884d8" />
                            <Line type="monotone" dataKey="sharesCount" name="Shares" stroke="#8884d8" />
                            <Line type="monotone" dataKey="commentsCount" name="Comments" stroke="#8884d8" />
                            <Tooltip labelFormatter={(value) => formatXAxis(value as string)} />
                        </LineChart>
                    </ResponsiveContainer>
                    :
                    <Typography>This post has no stats yet (Check again later)</Typography>
                }
            </Grid>
        </Grid>
    );
};

export default PostStatusChart;
