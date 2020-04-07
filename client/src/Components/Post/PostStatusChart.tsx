import { Grid } from '@material-ui/core';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';
import React from 'react';


const PostStatusChart: React.FC<{ statuses: any[] }> = ({ statuses }) => {

    return (
        <Grid container >
            <LineChart width={500} height={300} data={statuses}>
                <XAxis dataKey="timestamp" />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="positiveReactionsCount" stroke="#8884d8" />
                <Line type="monotone" dataKey="negativeReactionsCount" stroke="#82ca9d" />
                <Tooltip />
            </LineChart>
        </Grid>
    );
};

export default PostStatusChart;
