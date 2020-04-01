import { useQuery } from '@apollo/react-hooks';
import { Divider, List, ListItem, ListItemText, Typography, Grid, Link } from '@material-ui/core';
import React, { Fragment } from 'react';
import { PostsQueryData, POSTS_QUERY } from '../../GraphQL/Queries/PostsQuery';
import Loading from '../Loading/Loading';
import PlatformIcon from '../Platform/PlatformIcon';
import { Link as RouterLink } from 'react-router-dom';

const PostList: React.FC = () => {
    const { data, loading } = useQuery<PostsQueryData>(POSTS_QUERY);

    const dateFormatter = new Intl.DateTimeFormat('default', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric'
    });

    if (loading) return <Loading />;
    return (
        <Grid container direction="column">
            <Grid item>
                <Typography component="h1" variant="h3">Posts</Typography>
            </Grid>
            <Grid item>
                {!data ?
                    <Typography>There was an error loading your posts</Typography> :
                    <Fragment>
                        {data.posts.length === 0 && <Typography>You have no posts</Typography>}
                        <List>
                            {data!.posts.map(post => (
                                <Fragment>
                                    <Link to={`posts/${post.id}`} component={RouterLink}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText
                                                primary={dateFormatter.format(new Date(post.createdAt))}
                                                secondary={
                                                    <Grid container spacing={2}>
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
                                    <Divider component="li" />
                                </Fragment>
                            ))}
                        </List>
                    </Fragment>
                }
            </Grid>
        </Grid>
    );
};

export default PostList;
