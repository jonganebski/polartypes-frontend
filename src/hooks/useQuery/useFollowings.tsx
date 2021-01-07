import { gql, useLazyQuery } from '@apollo/client';
import {
  readFollowingsQuery,
  readFollowingsQueryVariables,
} from '../../__generated__/readFollowingsQuery';

export const READ_FOLLOWINGS = gql`
  query readFollowingsQuery($input: ReadFollowingsInput!) {
    readFollowings(input: $input) {
      ok
      error
      followings {
        id
      }
    }
  }
`;

export const useFollowings = () => {
  return useLazyQuery<readFollowingsQuery, readFollowingsQueryVariables>(
    READ_FOLLOWINGS,
  );
};
