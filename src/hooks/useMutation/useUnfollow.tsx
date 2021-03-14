import { ApolloCache, FetchResult, gql, useMutation } from '@apollo/client';
import {
  unfollowMutation,
  unfollowMutationVariables,
} from '../../__generated__/unfollowMutation';

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
  const update = (
    cache: ApolloCache<unfollowMutation>,
    { data }: FetchResult<unfollowMutation>,
  ) => {
    if (data) {
      const {
        unfollow: { targetUserId, error, ok },
      } = data;
      if (ok) {
        cache.modify({
          id: `Users:${targetUserId}`,
          fields: {
            countFollowers: (prev) => Math.max(prev - 1, 0),
            isFollowing: () => false,
          },
        });
      }
      if (error) {
        console.log(error);
      }
    }
  };

  return useMutation<unfollowMutation, unfollowMutationVariables>(
    UNFOLLOW_MUTATION,
    { update },
  );
};
