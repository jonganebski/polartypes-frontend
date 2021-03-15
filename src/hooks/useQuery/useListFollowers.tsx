import { gql, useLazyQuery } from '@apollo/client';
import { USER_CORE_FRAGMENT } from '../../fragments';
import {
  listFollowersQuery,
  listFollowersQueryVariables,
} from '../../__generated__/listFollowersQuery';

export const LIST_FOLLOWERS = gql`
  query listFollowersQuery($input: ListFollowersInput!) {
    listFollowers(input: $input) {
      ok
      error
      endCursorId
      hasNextPage
      user {
        slug
        followers {
          ...UserCoreParts
        }
      }
    }
  }
  ${USER_CORE_FRAGMENT}
`;

export const useListFollowers = () => {
  return useLazyQuery<listFollowersQuery, listFollowersQueryVariables>(
    LIST_FOLLOWERS,
  );
};
