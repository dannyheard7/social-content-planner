import { Grid, makeStyles } from '@material-ui/core';

import classNames from 'classnames';
import React, { Fragment, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './CreatePost.styles';
import { resetOrientation } from '../../Common/Image';

const useStyles = makeStyles(styles);

interface FileWithPreview extends File {
  preview?: string;
}

const CreatePost: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const classes = useStyles();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(await Promise.all(acceptedFiles.map(async (f) => await resetOrientation(f))));
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <Grid container direction="column">
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
        files.length > 0 && (
          <Fragment>
            <Grid item md={12}>
              <h3>Previews</h3>
            </Grid>
            <Grid item md={12} container direction="row">
              {files.map(file => (
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
          </Fragment>
        )
      }
    </Grid >
  );
};

export default CreatePost;
