import { useMutation, useQuery } from '@apollo/react-hooks';
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ErrorMessage, useForm } from 'react-hook-form';
import { useUploadFile } from '../../Common/FileUploadHook';
import { resetOrientation } from '../../Common/Image';
import { CREATE_POST_MUTATION, CreatePostMutationData, CreatePostMutationVars } from '../../GraphQL/Mutations/CreatePost';
import styles from './CreatePost.styles';
import { PlatformConnectionQueryData, PLATFORM_CONNECTIONS_QUERY } from '../../GraphQL/Queries/PlatformConnections';

const useStyles = makeStyles(styles);

interface FileWithPreview extends File {
  preview?: string;
}

const CreatePost: React.FC = () => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const { uploadFile, files } = useUploadFile();
  const [filePreviews, setFilePreviews] = useState<FileWithPreview[]>([]);
  const { data, loading } = useQuery<PlatformConnectionQueryData>(PLATFORM_CONNECTIONS_QUERY);
  const [createPost] = useMutation<CreatePostMutationData, CreatePostMutationVars>(CREATE_POST_MUTATION);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFilePreviews(await Promise.all(
      acceptedFiles.map(async (f) => {
        if (!filePreviews.some(file => file.name === f.name)) uploadFile(f);
        return await resetOrientation(f)
      })
    ));
  }, [uploadFile, filePreviews]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop, accept: 'image/*' });

  const onSubmit = (values: Record<string, any>) => {
    createPost({
      variables: {
        post: {
          text: values.text,
          images: files.map(f => f.id),
          networks: ["facebook"]
        }
      }
    })
  };

  if (loading) return <p>Loading</p>;
  if (!data) return <p>Error loading platforms</p>;

  return (
    <Grid container direction="column">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid item md={12}>
          <Typography variant="h3" component="h3">Images</Typography>
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
        <FormGroup>
          <TextField multiline={true} aria-label="Text" placeholder="Text" name="text" inputRef={register({ required: true })} error={errors.text !== undefined} />
          <ErrorMessage name="text" message="Post text is required" errors={errors} />
        </FormGroup>
        <Typography variant="h3" component="h3">Platforms</Typography>
        {data.platformConnections.map(pc => {
          return (
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    inputRef={register()}
                    name={`${pc.platform}-${pc.entityName}`}
                  />
                }
                label={`${pc.platform} - ${pc.entityName}`}
              />
            </FormGroup>
          )
        })}
        <Button type="submit" variant="contained">Create Post</Button>
      </form>
    </Grid >
  );
};

export default CreatePost;
