import { Grid } from '@material-ui/core';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, TooltipPayload, ResponsiveContainer } from 'recharts';
import React from 'react';


const PostStatusChart: React.FC<{ statuses: any[] }> = ({ statuses }) => {

    const dateFormatter = new Intl.DateTimeFormat('default', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric'
    });
    const formatXAxis = (tickItem: string) => dateFormatter.format(new Date(tickItem));

    return (
        <Grid container >
            <Grid item md={12}>
                <ResponsiveContainer width="99%" height={300}>
                    <LineChart data={statuses} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} height={300} width={300}>
                        <XAxis dataKey="timestamp" tickFormatter={formatXAxis} />
                        <YAxis />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="positiveReactionsCount" name="Positive Reactions" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="negativeReactionsCount" name="Negative Reactions" stroke="#8884d8" />
                        <Tooltip labelFormatter={(value) => formatXAxis(value as string)} />
                    </LineChart>
                </ResponsiveContainer>
            </Grid>
        </Grid>
    );
};

export default PostStatusChart;
