import { useQuery } from '@apollo/react-hooks';
import { Divider, List, ListItem, ListItemText, Link, Typography, Grid } from '@material-ui/core';
import React, { Fragment } from 'react';
import { PostsQueryData, POSTS_QUERY } from '../../GraphQL/Queries/PostsQuery';
import Loading from '../Loading/Loading';
import PlatformIcon from '../Platform/PlatformIcon';

const PostList: React.FC = () => {
    const { data, loading } = useQuery<PostsQueryData>(POSTS_QUERY);

    if (loading) return <Loading />;
    if (!data) return <p>There was an error loading your posts</p>;

    if (data.posts.length === 0) return <p>You have no posts</p>;

    return (
        <List>
            {data!.posts.map(post => (
                <Fragment>
                    <Link href={`posts/${post.id}`}>
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary={new Date(post.createdAt).toLocaleString()}
                                secondary={
                                    <Grid container>
                                        <Grid item>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="textPrimary"
                                            >
                                                {post.text}
                                            </Typography>
                                        </Grid>
                                        {post.platforms.map(platform => (
                                            <Grid item>
                                                <PlatformIcon platform={platform.platformConnection.platform} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                }
                            />
                        </ListItem>
                    </Link>
                    <Divider variant="inset" component="li" />
                </Fragment>
            ))}
        </List>
    );
};

export default PostList;
