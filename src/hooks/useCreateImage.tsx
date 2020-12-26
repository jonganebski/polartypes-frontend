import { gql, useMutation } from '@apollo/client';
import {
  createImageMutation,
  createImageMutationVariables,
} from '../__generated__/createImageMutation';

const CREATE_IMAGE_MUTATION = gql`
  mutation createImageMutation($input: CreateImageInput!) {
    createImage(input: $input) {
      ok
      error
      stepId
    }
  }
`;

export const useCreateImage = () => {
  return useMutation<createImageMutation, createImageMutationVariables>(
    CREATE_IMAGE_MUTATION,
  );
};
