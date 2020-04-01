import { useQuery } from '@apollo/react-hooks';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { PostQueryData, POST_QUERY } from '../../GraphQL/Queries/PostQuery';
import Loading from '../Loading/Loading';
import PlatformIcon from '../Platform/PlatformIcon';
import { IconButton, Link, Grid } from '@material-ui/core';
import { AppContext } from '../AppContext/AppContextProvider';

const Post: React.FC = () => {
  const { filesEndpoint } = useContext(AppContext);
  const { id } = useParams();
  const { data, loading } = useQuery<PostQueryData>(POST_QUERY, {
    variables: {
      id
    }
  });

  if (loading) return <Loading />;

  const post = data!.post;

  return (
    <Grid container direction="column">
      <Grid item>{new Date(post.createdAt).toLocaleString()}</Grid>
      <Grid item> {post.text}</Grid>
      <Grid container>
        {post.media.map(({ fileId }) => (
          <Grid item md={3} xs={4} key={fileId}>
            <img src={`${filesEndpoint}/${fileId}`} width="100%" height="auto" />
          </Grid>
        ))}
      </Grid>
      <Grid container>
        {post.platforms.map(platform => (
          <Grid item md={1} sm={1} xs={1} key={platform.platformConnection.id}>
            <Link href={platform.platformEntityUrl} target="_blank" rel="noreferrer" title={`View post on ${platform.platformConnection.platform}`}>
              <IconButton>
                <PlatformIcon platform={platform.platformConnection.platform} />
              </IconButton>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Post;
