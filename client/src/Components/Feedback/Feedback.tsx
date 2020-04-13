import { useMutation } from '@apollo/client';
import { Button, FormGroup, Grid, TextField, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { SendFeedbackMutationData, SendFeedbackMutationVars, SEND_FEEDBACK_MUTATION } from '../../GraphQL/Mutations/Feedback';
import { AuthenticationContext } from '../Authentication/AuthenticationContextProvider';
import Loading from '../Loading/Loading';

const Feedback: React.FC = () => {
     const { isAuthenticated, user } = useContext(AuthenticationContext);
     console.log(user);
     const { goBack } = useHistory();
     const { register, handleSubmit, errors } = useForm();

     const [sendFeedback, { data, loading }] = useMutation<SendFeedbackMutationData, SendFeedbackMutationVars>(SEND_FEEDBACK_MUTATION);

     if (loading) return <Loading />;

     const onSubmit = (values: Record<string, any>) => {
          sendFeedback({
               variables: {
                    email: isAuthenticated ? user.email : values.email,
                    feedback: {
                         message: values.message,
                    }
               }
          })
     };

     if (data && data.sendFeedback) {
          return (
               <Grid container direction="column" spacing={2}>
                    <Grid item md={12}>
                         <Typography variant="h2" component="h1">Submit Feedback</Typography>
                    </Grid>
                    <Grid item md={12}>
                         <Typography>
                              Thank you for submitting feedback.
                         </Typography>
                         <Button variant="contained" color="primary" onClick={() => goBack()}>
                              Go Back
                         </Button>
                    </Grid>
               </Grid>
          )
     }
     else {
          return (
               <Grid container direction="column" spacing={2}>
                    <Grid item md={12}>
                         <Typography variant="h2" component="h1">Submit Feedback</Typography>
                    </Grid>

                    <form onSubmit={handleSubmit(onSubmit)}>
                         <Grid container direction="column" spacing={3}>
                              <Grid item md={12}>
                                   <Typography>Any feedback is appreciated, including new features you would like or bugs you have seen</Typography>
                              </Grid>
                              {!isAuthenticated &&
                                   <Grid item>
                                        <FormGroup>
                                             <TextField multiline={true} aria-label="Email" placeholder="Email Address" name="email" inputRef={register()} error={errors.email !== undefined} />
                                        </FormGroup>
                                   </Grid>
                              }
                              <Grid item>
                                   <FormGroup>
                                        <TextField multiline={true} rows={5} aria-label="Message" placeholder="Message" name="message" inputRef={register({ required: true })} error={errors.message !== undefined} />
                                        <ErrorMessage name="message" message="Message is required" errors={errors} />
                                   </FormGroup>
                              </Grid>
                              <Grid item>
                                   <Button type="submit" variant="contained" color="primary">Submit Feedback</Button>
                              </Grid>
                         </Grid>
                    </form>
               </Grid >
          );
     }
};

export default Feedback;
