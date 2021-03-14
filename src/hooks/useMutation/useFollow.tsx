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
      targetUserId
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
        follow: { targetUserId, error, ok },
      } = data;
      if (ok) {
        cache.modify({
          id: `Users:${targetUserId}`,
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
