import { gql, useMutation } from '@apollo/client';
import {
  updateAccountMutation,
  updateAccountMutationVariables,
} from '../__generated__/updateAccountMutation';

const UPDATE_ACCOUNT_MUTATION = gql`
  mutation updateAccountMutation($input: UpdateAccountInput!) {
    updateAccount(input: $input) {
      ok
      error
    }
  }
`;

export const useUpdateAccount = (
  onCompleted: (data: updateAccountMutation) => void,
) => {
  return useMutation<updateAccountMutation, updateAccountMutationVariables>(
    UPDATE_ACCOUNT_MUTATION,
    { onCompleted },
  );
};
