import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { client } from '../../apollo';
import { ISettingsFormProps } from '../../components/Modals/Settings';
import { USER_FRAGMENT } from '../../fragments';
import { sleep } from '../../helpers';
import {
  updateAccountMutation,
  updateAccountMutationVariables,
} from '../../__generated__/updateAccountMutation';
import { UserParts } from '../../__generated__/UserParts';
import { useWhoAmI } from '../useQuery/useWhoAmI';

export const UPDATE_ACCOUNT_MUTATION = gql`
  mutation updateAccountMutation($input: UpdateAccountInput!) {
    updateAccount(input: $input) {
      ok
      error
    }
  }
`;

export const useUpdateAccount = (
  f: UseFormMethods<ISettingsFormProps>,
  avatarUrl: string | null,
) => {
  const { data: userData } = useWhoAmI();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const onCompleted = async (data: updateAccountMutation) => {
    const {
      updateAccount: { ok, error },
    } = data;
    if (ok && !error && userData) {
      const {
        about,
        city,
        firstName,
        lastName,
        username,
        timeZone,
      } = f.getValues();
      client.writeFragment<UserParts>({
        id: `Users:${userData.whoAmI.id}`,
        fragment: USER_FRAGMENT,
        fragmentName: 'UserParts',
        data: {
          __typename: 'Users',
          id: userData.whoAmI.id,
          about,
          avatarUrl,
          city,
          firstName,
          lastName,
          timeZone,
          username,
          slug: username.toLowerCase(),
        },
      });
      await sleep(2000);
      if (userData.whoAmI.username !== username) {
        history.push(`/${username}`);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };
  const [updateAccountMutation] = useMutation<
    updateAccountMutation,
    updateAccountMutationVariables
  >(UPDATE_ACCOUNT_MUTATION, { onCompleted });

  return { updateAccountMutation, isLoading, setIsLoading };
};
