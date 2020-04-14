import { gql } from '@apollo/client';

export const SEND_FEEDBACK_MUTATION = gql`
  mutation sendFeedback($email: String, $feedback: SendFeebackInput!) {
    sendFeedback(email: $email, feedback: $feedback)
  }
`;

export interface SendFeedbackMutationVars {
  email?: string,
  feedback: {
    message: string
  }
}

export interface SendFeedbackMutationData {
  sendFeedback: boolean
}