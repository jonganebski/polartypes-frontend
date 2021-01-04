import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { client } from '../../apollo';
import { targetUser } from '../../__generated__/targetUser';
import {
  unfollowMutation,
  unfollowMutationVariables,
} from '../../__generated__/unfollowMutation';
import { useWhoAmI } from '../useQuery/useWhoAmI';

const UNFOLLOW_MUTATION = gql`
  mutation unfollowMutation($input: UnfollowInput!) {
    unfollow(input: $input) {
      ok
      error
    }
  }
`;

export const useUnfollow = (targetUserId?: number) => {
  const [lazyWhoAmIQuery, { data: userData }] = useWhoAmI();
  useEffect(() => {
    lazyWhoAmIQuery();
  }, [lazyWhoAmIQuery]);
  const onCompleted = (data: unfollowMutation) => {
    const {
      unfollow: { ok, error },
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
              ...targetUser.followers.filter(
                (follower) => follower.id !== userData.whoAmI.id,
              ),
            ],
          },
        });
    }
  };
  return useMutation<unfollowMutation, unfollowMutationVariables>(
    UNFOLLOW_MUTATION,
    { onCompleted },
  );
};
