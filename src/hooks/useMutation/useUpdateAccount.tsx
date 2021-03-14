import { ApolloCache, FetchResult, gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
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
  const [lazyWhoAmIQuery, { data: userData }] = useWhoAmI();
  useEffect(() => {
    lazyWhoAmIQuery();
  }, [lazyWhoAmIQuery]);
  // const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  // const onCompleted = async (data: updateAccountMutation) => {
  //   const {
  //     updateAccount: { ok, error },
  //   } = data;
  //   if (ok && !error && userData) {
  //     const {
  //       about,
  //       city,
  //       firstName,
  //       lastName,
  //       username,
  //       timeZone,
  //     } = f.getValues();
  //     client.writeFragment<UserParts>({
  //       id: `Users:${userData.whoAmI.id}`,
  //       fragment: USER_FRAGMENT,
  //       fragmentName: 'UserParts',
  //       data: {
  //         __typename: 'Users',
  //         id: userData.whoAmI.id,
  //         about,
  //         avatarUrl,
  //         city,
  //         firstName,
  //         lastName,
  //         timeZone,
  //         username,
  //         slug: username.toLowerCase(),
  //       },
  //     });
  //     await sleep(2000);
  //     if (userData.whoAmI.username !== username) {
  //       history.push(`/${username}`);
  //     } else {
  //       setIsLoading(false);
  //     }
  //   } else {
  //     setIsLoading(false);
  //   }
  // };

  const update = (
    cache: ApolloCache<updateAccountMutation>,
    { data }: FetchResult<updateAccountMutation>,
  ) => {
    if (data) {
      const {
        updateAccount: { error, ok },
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
          id: `User:${userData?.whoAmI.slug}`,
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
      if (error) {
        console.log(error);
      }
    }
  };

  const [updateAccountMutation] = useMutation<
    updateAccountMutation,
    updateAccountMutationVariables
  >(UPDATE_ACCOUNT_MUTATION, { update });

  return { updateAccountMutation, isLoading, setIsLoading };
};
