import { gql, useLazyQuery } from '@apollo/client';
import { USER_CORE_FRAGMENT } from '../../fragments';
import {
  listFollowingsQuery,
  listFollowingsQueryVariables,
} from '../../__generated__/listFollowingsQuery';

export const LIST_FOLLOWINGS = gql`
  query listFollowingsQuery($input: ListFollowingsInput!) {
    listFollowings(input: $input) {
      ok
      error
      user {
        slug
        followings {
          ...UserCoreParts
        }
      }
    }
  }
  ${USER_CORE_FRAGMENT}
`;

export const useListFollowings = () => {
  return useLazyQuery<listFollowingsQuery, listFollowingsQueryVariables>(
    LIST_FOLLOWINGS,
  );
};
