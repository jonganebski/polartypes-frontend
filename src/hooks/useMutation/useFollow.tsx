import { ApolloCache, FetchResult, gql, useMutation } from '@apollo/client';
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
  const { me } = useWhoAmI();

  const update = (
    cache: ApolloCache<followMutation>,
    { data }: FetchResult<followMutation>,
  ) => {
    if (data) {
      const {
        follow: { slug, error, ok },
      } = data;
      if (ok && me?.slug) {
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
