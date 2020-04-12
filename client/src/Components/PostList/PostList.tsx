import { useQuery } from '@apollo/client';
import { Divider, Grid, Link, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import React, { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { PostsQueryData, POSTS_QUERY } from '../../GraphQL/Queries/PostsQuery';
import Loading from '../Loading/Loading';
import PlatformIcon from '../Platform/PlatformIcon';
import StatusSummary from '../Status/StatusSummary';

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
                        {data.posts.length === 0 &&
                            <Typography>
                                You have no posts, would you like to <Link to="/post/new" component={RouterLink}>create one</Link>?
                            </Typography>
                        }
                        <List>
                            {data.posts.map(post => (
                                <Fragment>
                                    <Link to={`posts/${post.id}`} component={RouterLink} underline="none">
                                        <ListItem alignItems="flex-start">
                                            <ListItemText
                                                primary={dateFormatter.format(new Date(post.createdAt))}
                                                secondary={
                                                    <Grid container spacing={2}>
                                                        <Grid item md={12}>
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
                                                        {post.latestStatus &&
                                                            <StatusSummary status={post.latestStatus} />
                                                        }
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
