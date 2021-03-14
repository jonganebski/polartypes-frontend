import { ApolloCache, FetchResult, gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
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
      slug
    }
  }
`;

export const useUnfollow = () => {
  const [whoAmIQuery, { data: userData }] = useWhoAmI();

  useEffect(() => {
    whoAmIQuery();
  }, []);
  const update = (
    cache: ApolloCache<unfollowMutation>,
    { data }: FetchResult<unfollowMutation>,
  ) => {
    if (data) {
      const {
        unfollow: { slug, error, ok },
      } = data;
      if (ok && userData?.whoAmI.slug) {
        cache.modify({
          id: `User:${slug}`,
          fields: {
            countFollowers: (prev) => Math.max(prev - 1, 0),
            isFollowing: () => false,
            followers: (prev) =>
              prev.filter(
                (user: any) => user['__ref'] !== `User:${userData.whoAmI.slug}`,
              ),
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
