import { useQuery } from '@apollo/react-hooks';
import { Grid } from '@material-ui/core';
import React from 'react';
import { PostsQueryData, POSTS_QUERY } from '../../GraphQL/Queries/PostsQuery';
import Loading from '../Loading/Loading';

const PostList: React.FC = () => {
  const { data, loading } = useQuery<PostsQueryData>(POSTS_QUERY);

  if (loading) return <Loading />

  return (
    <Grid container direction="column">
      {data!.posts.map(post => (
        <Grid item>
          <p>{post.id}</p>
          <p>{post.text}</p>
          <Grid container>
            {post.platforms.map(platform => (
              <Grid item>
                <a href={platform.platformEntityUrl}>View post on {platform.platformConnection.platform}</a>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))}
    </Grid >
  );
};

export default PostList;
