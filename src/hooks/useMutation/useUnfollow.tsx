import { ApolloCache, FetchResult, gql, useMutation } from '@apollo/client';
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
      id
    }
  }
`;

export const useUnfollow = () => {
  const { me } = useWhoAmI();

  const update = (
    cache: ApolloCache<unfollowMutation>,
    { data }: FetchResult<unfollowMutation>,
  ) => {
    if (data) {
      const {
        unfollow: { id, error, ok },
      } = data;
      if (ok && me?.id) {
        cache.modify({
          id: `Users:${id}`,
          fields: {
            countFollowers: (prev) => Math.max(prev - 1, 0),
            isFollowing: () => false,
            followers: (prev) =>
              prev.filter((user: any) => user['__ref'] !== `Users:${me.id}`),
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
