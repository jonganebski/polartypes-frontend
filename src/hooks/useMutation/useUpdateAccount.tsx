import { ApolloCache, FetchResult, gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { ISettingsFormProps } from '../../components/Modals/Settings';
import {
  updateAccountMutation,
  updateAccountMutationVariables,
} from '../../__generated__/updateAccountMutation';
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
  const { me } = useWhoAmI();

  const [isLoading, setIsLoading] = useState(false);

  const update = (
    cache: ApolloCache<updateAccountMutation>,
    { data }: FetchResult<updateAccountMutation>,
  ) => {
    if (data && me) {
      const {
        updateAccount: { ok },
      } = data;
      if (ok) {
        const {
          about,
          city,
          firstName,
          lastName,
          username,
          timeZone,
        } = f.getValues();
        cache.modify({
          id: `User:${me.slug}`,
          fields: {
            about: () => about,
            city: () => city,
            firstName: () => firstName,
            lastName: () => lastName,
            username: () => username,
            timeZone: () => timeZone,
            avatarUrl: () => avatarUrl,
          },
        });
      }
    }
  };

  const [updateAccountMutation] = useMutation<
    updateAccountMutation,
    updateAccountMutationVariables
  >(UPDATE_ACCOUNT_MUTATION, { update });

  return { updateAccountMutation, isLoading, setIsLoading };
};
