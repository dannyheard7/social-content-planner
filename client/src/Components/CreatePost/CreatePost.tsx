import { useMutation, useQuery } from '@apollo/client';
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import classNames from 'classnames';
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ErrorMessage, useForm } from 'react-hook-form';
import { useUploadFile } from '../../Common/FileUploadHook';
import { resetOrientation } from '../../Common/Image';
import { CREATE_POST_MUTATION, CreatePostMutationData, CreatePostMutationVars } from '../../GraphQL/Mutations/CreatePost';
import styles from './CreatePost.styles';
import { PlatformConnectionQueryData, PLATFORM_CONNECTIONS_QUERY } from '../../GraphQL/Queries/PlatformConnections';
import { POSTS_QUERY, PostsQueryData } from '../../GraphQL/Queries/PostsQuery';
import { useHistory } from 'react-router-dom';
import Loading from '../Loading/Loading';

const useStyles = makeStyles(styles);

interface FileWithPreview extends File {
     preview?: string;
}

const CreatePost: React.FC = () => {
     const classes = useStyles();
     const { push } = useHistory();
     const { register, handleSubmit, errors } = useForm();
     const { uploadFile, files } = useUploadFile();
     const [filePreviews, setFilePreviews] = useState<FileWithPreview[]>([]);
     const { data, loading } = useQuery<PlatformConnectionQueryData>(PLATFORM_CONNECTIONS_QUERY);
     const [createPost, { data: mutationData, loading: mutationLoading }] = useMutation<CreatePostMutationData, CreatePostMutationVars>(
          CREATE_POST_MUTATION,
          {
               update(cache, { data: { createPost } }) {
                    const data = cache.readQuery<PostsQueryData>({ query: POSTS_QUERY });

                    cache.writeQuery<PostsQueryData>({
                         query: POSTS_QUERY,
                         data: {
                              posts: data ? [createPost, ...data.posts] : [createPost]
                         }
                    });
               }
          });

     useEffect(() => {
          if (mutationData && mutationData.createPost) push(`/posts/${mutationData.createPost.id}`);
     }, [mutationData, push])

     const onDrop = useCallback(async (acceptedFiles: File[]) => {
          const newFilePreviews = await Promise.all(
               acceptedFiles.map((f) => {
                    if (!filePreviews.some(file => file.name === f.name)) uploadFile(f);
                    return resetOrientation(f)
               }))

          setFilePreviews(f => ([...f, ...newFilePreviews]));
     }, [uploadFile, filePreviews]);

     const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop, accept: 'image/*' });

     if (loading || mutationLoading) return <Loading />;
     if (!data) return <p>Error loading platforms</p>;

     const onSubmit = (values: Record<string, any>) => {
          const platformConnectionIds = data.platformConnections.map(pc => pc.id);
          createPost({
               variables: {
                    post: {
                         text: values.text,
                         images: files.map(f => f.id),
                         platformConnections: platformConnectionIds.filter(pcId => values[pcId] === true)
                    }
               }
          })
     };

     return (
          <Grid container direction="column" spacing={2}>
               <Grid item md={12}>
                    <Typography variant="h2" component="h1">Create Post</Typography>
               </Grid>
               <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container direction="column" spacing={1}>
                         <Grid item md={12}>
                              <Typography variant="h4" component="h2">Images</Typography>
                         </Grid>
                         <Grid item md={12}>
                              <div {...getRootProps()} className={classNames(classes.imageDropContainer, {
                                   [classes.imageDropContinerActive]: isDragActive,
                                   [classes.imageDropContinerAccept]: isDragAccept,
                                   [classes.imageDropContinerReject]: isDragReject
                              })} >
                                   <input {...getInputProps()} />
                                   {isDragActive ? (
                                        <p>Drop the files here ...</p>
                                   ) : (
                                             <p>Drag 'n' drop some files here, or click to select files</p>
                                        )}
                              </div>
                         </Grid>
                         {
                              filePreviews.length > 0 && (
                                   <Grid item md={12} container direction="row">
                                        {filePreviews.map(file => (
                                             <Grid item md={3}>
                                                  <img
                                                       alt="Preview"
                                                       key={file.preview}
                                                       src={file.preview}
                                                       className={classes.imagePreview}

                                                       width="100%"
                                                  />
                                             </Grid>
                                        ))}
                                   </Grid>
                              )
                         }
                         <Grid item>
                              <FormGroup>
                                   <TextField multiline={true} aria-label="Text" placeholder="Text" name="text" inputRef={register({ required: true })} error={errors.text !== undefined} />
                                   <ErrorMessage name="text" message="Post text is required" errors={errors} />
                              </FormGroup>
                         </Grid>
                         <Grid item>
                              <Typography variant="h4" component="h2">Platforms</Typography>
                         </Grid>
                         {data.platformConnections.map(pc => {
                              return (
                                   <Grid item>
                                        <FormGroup>
                                             <FormControlLabel
                                                  control={
                                                       <Checkbox
                                                            inputRef={register()}
                                                            name={pc.id}
                                                       />
                                                  }
                                                  label={`${pc.platform} - ${pc.entityName}`}
                                             />
                                        </FormGroup>
                                   </Grid>
                              )
                         })}
                         <Grid item>
                              <Button type="submit" variant="contained">Create Post</Button>
                         </Grid>
                    </Grid>
               </form>
          </Grid >
     );
};

export default CreatePost;
