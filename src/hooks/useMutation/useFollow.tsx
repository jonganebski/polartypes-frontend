import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { client } from '../../apollo';
import {
  followMutation,
  followMutationVariables,
} from '../../__generated__/followMutation';
import {
  readFollowingsQuery,
  readFollowingsQueryVariables,
} from '../../__generated__/readFollowingsQuery';
import { targetUser } from '../../__generated__/targetUser';
import { READ_FOLLOWINGS } from '../useQuery/useFollowings';
import { useWhoAmI } from '../useQuery/useWhoAmI';

const FOLLOW_MUTAION = gql`
  mutation followMutation($input: FollowInput!) {
    follow(input: $input) {
      ok
      error
      targetUserId
    }
  }
`;

export const useFollow = () => {
  const [lazyWhoAmIQuery, { data: userData }] = useWhoAmI();
  useEffect(() => {
    lazyWhoAmIQuery();
  }, [lazyWhoAmIQuery]);
  const onCompleted = (data: followMutation) => {
    const {
      follow: { ok, error, targetUserId },
    } = data;
    if (ok && !error && targetUserId && userData) {
      const targetUser = client.readFragment<targetUser>({
        id: `Users:${targetUserId}`,
        fragment: gql`
          fragment targetUser on Users {
            followers {
              id
            }
          }
        `,
      });
      targetUser &&
        client.writeFragment<targetUser>({
          id: `Users:${targetUserId}`,
          fragment: gql`
            fragment targetUser on Users {
              followers {
                id
              }
            }
          `,
          data: {
            __typename: 'Users',
            followers: [
              ...targetUser?.followers,
              { __typename: 'Users', id: userData.whoAmI.id },
            ],
          },
        });
      const prevQuery = client.readQuery<
        readFollowingsQuery,
        readFollowingsQueryVariables
      >({
        query: READ_FOLLOWINGS,
        variables: { input: { targetUserId: userData.whoAmI.id } },
      });
      prevQuery &&
        prevQuery.readFollowings.followings &&
        client.writeQuery<readFollowingsQuery, readFollowingsQueryVariables>({
          query: READ_FOLLOWINGS,
          variables: { input: { targetUserId: userData.whoAmI.id } },
          data: {
            readFollowings: {
              ...prevQuery.readFollowings,
              followings: [
                ...prevQuery.readFollowings.followings,
                { id: targetUserId, __typename: 'Users' },
              ],
            },
          },
        });
    }
  };

  return useMutation<followMutation, followMutationVariables>(FOLLOW_MUTAION, {
    onCompleted,
  });
};
