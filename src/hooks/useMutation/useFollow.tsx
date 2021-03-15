import { ApolloCache, FetchResult, gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  followMutation,
  followMutationVariables,
} from '../../__generated__/followMutation';
import { useWhoAmI } from '../useQuery/useWhoAmI';

const FOLLOW_MUTAION = gql`
  mutation followMutation($input: FollowInput!) {
    follow(input: $input) {
      ok
      error
      slug
    }
  }
`;

export const useFollow = () => {
  const [whoAmIQuery, { data: userData }] = useWhoAmI();

  useEffect(() => {
    whoAmIQuery();
  }, []);
  const update = (
    cache: ApolloCache<followMutation>,
    { data }: FetchResult<followMutation>,
  ) => {
    if (data) {
      const {
        follow: { slug, error, ok },
      } = data;
      if (ok && userData?.whoAmI.slug) {
        cache.modify({
          id: `User:${slug}`,
          fields: {
            countFollowers: (prev) => prev + 1,
            isFollowing: () => true,
          },
        });
      }
      if (error) {
        console.log(error);
      }
    }
  };

  return useMutation<followMutation, followMutationVariables>(FOLLOW_MUTAION, {
    update,
  });
};
