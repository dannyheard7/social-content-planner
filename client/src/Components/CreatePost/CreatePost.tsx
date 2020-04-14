import { useMutation, useQuery } from '@apollo/client';
import { Button, Card, CardActions, CardContent, Fab, FormGroup, Grid, Icon, Link, makeStyles, TextField, Tooltip, Typography, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from '@material-ui/core';
import { Add as AddIcon, Clear as RemoveIcon } from '@material-ui/icons';
import classNames from 'classnames';
import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { useDropzone } from 'react-dropzone';
import { ErrorMessage, useForm } from 'react-hook-form';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useUploadFile } from '../../Common/FileUploadHook';
import PlatformConnection from '../../Common/Interfaces/PlatformConnection';
import { UploadedFile } from '../../Common/Interfaces/UploadedFile';
import { CreatePostMutationData, CreatePostMutationVars, CREATE_POST_MUTATION } from '../../GraphQL/Mutations/CreatePost';
import { PlatformConnectionQueryData, PLATFORM_CONNECTIONS_QUERY } from '../../GraphQL/Queries/PlatformConnections';
import { PostsQueryData, POSTS_QUERY } from '../../GraphQL/Queries/PostsQuery';
import { AppContext } from '../AppContext/AppContextProvider';
import Loading from '../Loading/Loading';
import PlatformIcon from '../Platform/PlatformIcon';
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

const PostPlatforms: React.FC<{
     possibleConnections: PlatformConnection[],
     selectedConnections?: PlatformConnection[],
     onChangeConnections: (connections: PlatformConnection[]) => void
}> = ({ possibleConnections, selectedConnections, onChangeConnections }) => {
     const unselectedConnections = possibleConnections.filter(pc => !selectedConnections?.some(sc => sc.id === pc.id) || true);
     const [dialogOpen, setDialogOpen] = useState(false);

     return (
          <Grid container direction="column" spacing={1}>
               <Grid item>
                    <Typography variant="h4" component="h2">Platforms</Typography>
               </Grid>
               <Grid container item spacing={1}>
                    {selectedConnections?.map(pc => {
                         return (
                              <Grid item md={3}>
                                   <Card >
                                        <CardContent>
                                             <Icon>
                                                  <PlatformIcon platform={pc.platform} />
                                             </Icon>
                                             <Typography >
                                                  {pc.entityName}
                                             </Typography>
                                        </CardContent>
                                        <CardActions>
                                             <Button size="small" onClick={() => onChangeConnections(selectedConnections!.filter(sc => sc.id !== pc.id))}>
                                                  Remove
                                             </Button>
                                        </CardActions>
                                   </Card>
                              </Grid>
                         )
                    })}
                    {unselectedConnections.length > 0 &&
                         <Grid item md={3} container alignContent="center">
                              <Fab onClick={() => setDialogOpen(true)} size="small">
                                   <AddIcon />
                              </Fab>
                         </Grid>
                    }
               </Grid>
               {dialogOpen &&
                    <Dialog aria-labelledby="simple-dialog-title" open={dialogOpen} onClose={() => setDialogOpen(false)}>
                         <DialogTitle id="simple-dialog-title">Choose platform</DialogTitle>
                         <DialogContent>
                              <List>
                                   {unselectedConnections.map((platform) => (
                                        <ListItem button onClick={() => {
                                             onChangeConnections(selectedConnections ? [...selectedConnections, platform] : [platform]);
                                             setDialogOpen(false);
                                        }} key={platform.id}>
                                             <ListItemText
                                                  primary={platform.entityName}
                                                  secondary={platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1).toLowerCase()}
                                             />
                                        </ListItem>
                                   ))}
                              </List>
                         </DialogContent>
                    </Dialog>
               }
          </Grid>
     )
}

const CreatePost: React.FC = () => {
     const classes = useStyles();
     const { push } = useHistory();
     const { register, handleSubmit, errors, setValue, watch } = useForm();

     useEffect(() => {
          register({ name: 'platforms', type: 'custom' }, { required: true })
     }, [register]);

     const { uploadFile, files, onFilesRearranged, removeImage, fileUploadInProgress } = useUploadFile();

     const onDrop = useCallback(async (acceptedFiles: File[]) => await Promise.all(acceptedFiles.map((f) => uploadFile(f))), [uploadFile]);
     const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop, accept: 'image/*' });

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
     }, [mutationData, push]);

     if (loading || mutationLoading) return <Loading />;
     if (!data) return <p>Error loading platforms</p>;

     const onSubmit = (values: Record<string, any>) => {
          const platformConnectionIds = data.platformConnections.map(pc => pc.id);
          createPost({
               variables: {
                    post: {
                         text: values.text,
                         images: files.map(f => f.id),
                         platformConnections: (values.platforms as PlatformConnection[]).map(pc => pc.id)
                    }
               }
          })
     };

     if (data.platformConnections.length === 0) {
          return (
               <Grid container direction="column" spacing={2}>
                    <Grid item md={12}>
                         <Typography component="h1" variant="h3">Create Post</Typography>
                    </Grid>
                    <Grid item md={12}>
                         <Typography>
                              You currently have no connected platforms, you can add one <Link to="/platforms" component={RouterLink}>here</Link>
                         </Typography>
                    </Grid>
               </Grid>
          )
     } else {
          return (
               <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container direction="column" spacing={2}>
                         <Grid item md={12}>
                              <Typography component="h1" variant="h3">Create Post</Typography>
                         </Grid>

                         <Grid item md={12}>
                              <Typography variant="h4" component="h2">Images</Typography>
                         </Grid>
                         <Grid item md={12}>
                              <div {...getRootProps()} className={classNames(classes.imageDropContainer, {
                                   [classes.imageDropContainerActive]: isDragActive,
                                   [classes.imageDropContainerAccept]: isDragAccept,
                                   [classes.imageDropContainerReject]: isDragReject
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
                                   <TextField
                                        multiline={true} rows={3} aria-label="Text" placeholder="Text" name="text"
                                        inputRef={register({ required: true })} error={errors.text !== undefined} />
                                   <ErrorMessage name="text" message="Post text is required" errors={errors} />
                              </FormGroup>
                         </Grid>
                         <Grid item>
                              <PostPlatforms
                                   possibleConnections={data.platformConnections}
                                   selectedConnections={watch('platforms') as PlatformConnection[]}
                                   onChangeConnections={(platforms) => setValue('platforms', platforms)} />
                              <ErrorMessage name="platforms" message="You must select at least one platform to post to" errors={errors} />
                         </Grid>

                         <Grid item container justify="flex-end">
                              <Button type="submit" variant="contained" color="primary">Create Post</Button>
                         </Grid>
                    </Grid>
               </form>
          );
     }
};

export default CreatePost;
