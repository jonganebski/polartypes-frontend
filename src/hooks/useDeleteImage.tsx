import { gql, useMutation } from '@apollo/client';
import {
  deleteImageMutation,
  deleteImageMutationVariables,
} from '../__generated__/deleteImageMutation';

const DELETE_IMAGE_MUTATION = gql`
  mutation deleteImageMutation($input: DeleteImagesInput!) {
    deleteImage(input: $input) {
      ok
      error
    }
  }
`;

export const useDeleteImage = () => {
  return useMutation<deleteImageMutation, deleteImageMutationVariables>(
    DELETE_IMAGE_MUTATION,
  );
};
