import { ApolloCache, FetchResult, gql, useMutation } from '@apollo/client';
import {
  followMutation,
  followMutationVariables,
} from '../../__generated__/followMutation';

const FOLLOW_MUTAION = gql`
  mutation followMutation($input: FollowInput!) {
    follow(input: $input) {
      ok
      error
      id
    }
  }
`;

export const useFollow = () => {
  const update = (
    cache: ApolloCache<followMutation>,
    { data }: FetchResult<followMutation>,
  ) => {
    if (data) {
      const {
        follow: { id, error, ok },
      } = data;
      if (ok) {
        cache.modify({
          id: `Users:${id}`,
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
