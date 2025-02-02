import { useQuery } from '@apollo/client';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { PostQueryData, POST_QUERY, PostQueryVars } from '../../GraphQL/Queries/PostQuery';
import Loading from '../Loading/Loading';
import PlatformIcon from '../Platform/PlatformIcon';
import { IconButton, Link, Grid, Typography } from '@material-ui/core';
import { AppContext } from '../AppContext/AppContextProvider';
import PostStatusChart from './PostStatusChart';
import StatusSummary from '../Status/StatusSummary';

const Post: React.FC = () => {
  const { filesEndpoint } = useContext(AppContext);
  const { id } = useParams();
  const { data, loading } = useQuery<PostQueryData, PostQueryVars>(POST_QUERY, {
    variables: {
      id: id!
    }
  });


  if (loading) return <Loading />;

  const dateFormatter = new Intl.DateTimeFormat('default', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric'
  });

  const post = data!.post;

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item><Typography variant="h4" component="h4">{dateFormatter.format(new Date(post.createdAt))}</Typography></Grid>
      <Grid item><Typography>{post.text}</Typography></Grid>
      <Grid container item>
        {post.media.map(({ fileId }, index) => (
          <Grid item md={3} xs={4} key={fileId}>
            <img src={`${filesEndpoint}/${fileId}?size=small`} width="100%" height="auto" alt={`Post media ${index + 1}`} />
          </Grid>
        ))}
      </Grid>
      <Grid item>
        {post.status.length > 0 &&
          <StatusSummary status={post.status[post.status.length - 1]} />
        }
      </Grid>
      <Grid container item>
        {post.platforms.map(platform => (
          <Grid item md={1} sm={1} xs={1} key={platform.id}>
            <Link href={platform.platformEntityUrl} target="_blank" rel="noreferrer" title={`View post on ${platform.platform}`}>
              <IconButton>
                <PlatformIcon platform={platform.platform} />
              </IconButton>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Grid item>
        <PostStatusChart statuses={post.status} />
      </Grid>
    </Grid>
  );
};

export default Post;
