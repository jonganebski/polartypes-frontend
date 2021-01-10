import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { client } from '../../apollo';
import {
  readFollowingsQuery,
  readFollowingsQueryVariables,
} from '../../__generated__/readFollowingsQuery';
import { targetUser } from '../../__generated__/targetUser';
import {
  unfollowMutation,
  unfollowMutationVariables,
} from '../../__generated__/unfollowMutation';
import { READ_FOLLOWINGS } from '../useQuery/useFollowings';
import { useWhoAmI } from '../useQuery/useWhoAmI';

const UNFOLLOW_MUTATION = gql`
  mutation unfollowMutation($input: UnfollowInput!) {
    unfollow(input: $input) {
      ok
      error
      targetUserId
    }
  }
`;

export const useUnfollow = () => {
  const [lazyWhoAmIQuery, { data: userData }] = useWhoAmI();
  useEffect(() => {
    lazyWhoAmIQuery();
  }, [lazyWhoAmIQuery]);
  const onCompleted = (data: unfollowMutation) => {
    const {
      unfollow: { ok, error, targetUserId },
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
            followers: targetUser.followers.filter(
              (follower) => follower.id !== userData.whoAmI.id,
            ),
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
              followings: prevQuery.readFollowings.followings.filter(
                (f) => f.id !== targetUserId,
              ),
            },
          },
        });
    }
  };
  return useMutation<unfollowMutation, unfollowMutationVariables>(
    UNFOLLOW_MUTATION,
    { onCompleted },
  );
};
