import { useMutation, useQuery } from '@apollo/client';
import { Button, Checkbox, Fab, FormControlLabel, FormGroup, Grid, Link, makeStyles, TextField, Typography, Tooltip } from '@material-ui/core';
import { Clear as RemoveIcon } from '@material-ui/icons';
import classNames from 'classnames';
import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { useDropzone } from 'react-dropzone';
import { ErrorMessage, useForm } from 'react-hook-form';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useUploadFile } from '../../Common/FileUploadHook';
import { UploadedFile } from '../../Common/Interfaces/UploadedFile';
import { CreatePostMutationData, CreatePostMutationVars, CREATE_POST_MUTATION } from '../../GraphQL/Mutations/CreatePost';
import { PlatformConnectionQueryData, PLATFORM_CONNECTIONS_QUERY } from '../../GraphQL/Queries/PlatformConnections';
import { PostsQueryData, POSTS_QUERY } from '../../GraphQL/Queries/PostsQuery';
import { AppContext } from '../AppContext/AppContextProvider';
import Loading from '../Loading/Loading';
import styles from './CreatePost.styles';

const useStyles = makeStyles(styles);

const DraggablePostImage: React.FC<{ file: UploadedFile, index: number, onRemoveImage: (file: UploadedFile) => void }> = ({ file, index, onRemoveImage }) => {
     const { filesEndpoint } = useContext(AppContext);
     const classes = useStyles();
     const [isHoveredOver, setIsHoveredOver] = useState(false);

     return (
          <Draggable draggableId={file.id} index={index}>
               {provided => (
                    <Grid item md={3}
                         ref={provided.innerRef}
                         {...provided.draggableProps}
                         {...provided.dragHandleProps}
                         className={classes.imagePreviewContainer}
                         onMouseEnter={() => setIsHoveredOver(true)}
                         onMouseLeave={() => setIsHoveredOver(false)}
                    >
                         <img
                              src={`${filesEndpoint}/${file.id}?size=small`}
                              width="100%"
                              height="auto"
                              key={file.id}
                              alt={`Preview`}
                              className={classes.imagePreview} />
                         {isHoveredOver &&
                              <Tooltip title="Remove image">
                                   <Fab className={classes.clearImageButton} color="secondary" size="small" onClick={() => onRemoveImage(file)}>
                                        <RemoveIcon />
                                   </Fab>
                              </Tooltip>
                         }
                    </Grid>
               )}
          </Draggable>
     )
}

const PostImages: React.FC<{
     files: UploadedFile[],
     fileUploadInProgress: boolean,
     onFilesRearranged: (files: UploadedFile[]) => void,
     removeImage: (file: UploadedFile) => void
}> = ({ files, onFilesRearranged, removeImage, fileUploadInProgress }) => {
     const onDragEnd = (result: DropResult) => {
          if (!result.destination || result.destination.index === result.source.index)
               return;

          if (result.destination.index > result.source.index) {
               onFilesRearranged([
                    ...files.slice(0, result.source.index),
                    ...files.slice(result.source.index + 1, result.destination.index + 1),
                    ...files.slice(result.source.index, result.source.index + 1),
                    ...files.slice(result.destination.index + 1)
               ]);
          } else {
               onFilesRearranged([
                    ...files.slice(0, result.destination.index),
                    ...files.slice(result.source.index, result.source.index + 1),
                    ...files.slice(result.destination.index, result.source.index),
                    ...files.slice(result.source.index + 1)
               ])
          }
     }

     return (
          <Fragment>
               <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable direction="horizontal" droppableId="Images">
                         {provided => (
                              <Grid item md={12} container direction="row" ref={provided.innerRef} {...provided.droppableProps}>
                                   {files.map((file, index) => <DraggablePostImage file={file} index={index} key={file.id} onRemoveImage={removeImage} />)}
                                   {provided.placeholder}
                                   {fileUploadInProgress && <Loading />}
                              </Grid>
                         )}
                    </Droppable>
               </DragDropContext>
          </Fragment>
     )
}

const CreatePost: React.FC = () => {
     const classes = useStyles();
     const { push } = useHistory();
     const { register, handleSubmit, errors } = useForm();
     const { uploadFile, files, onFilesRearranged, removeImage, fileUploadInProgress } = useUploadFile();
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
          await Promise.all(acceptedFiles.map((f) => uploadFile(f)));
     }, [uploadFile]);

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

     if (data.platformConnections.length === 0) {
          return (
               <Grid container direction="column" spacing={2}>
                    <Grid item md={12}>
                         <Typography variant="h2" component="h1">Create Post</Typography>
                    </Grid>
                    <Grid item md={12}>
                         <Typography>
                              You currently have no connected platforms, you can add one <Link to="/platforms" component={RouterLink}>here</Link>
                         </Typography>
                    </Grid>
               </Grid>
          )
     }
     else {
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
                              <PostImages files={files} onFilesRearranged={onFilesRearranged} removeImage={removeImage} fileUploadInProgress={fileUploadInProgress} />
                              <Grid item>
                                   <FormGroup>
                                        <TextField multiline={true} rows={3} aria-label="Text" placeholder="Text" name="text" inputRef={register({ required: true })} error={errors.text !== undefined} />
                                        <ErrorMessage name="text" message="Post text is required" errors={errors} />
                                   </FormGroup>
                              </Grid>
                              <Grid item>
                                   <Typography variant="h4" component="h2">Platforms</Typography>
                              </Grid>
                              {data.platformConnections.map(pc => {
                                   return (
                                        <Grid item key={pc.id}>
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
                                   <Button type="submit" variant="contained" color="primary">Create Post</Button>
                              </Grid>
                         </Grid>
                    </form>
               </Grid >
          );
     }
};

export default CreatePost;
