import { gql, useLazyQuery } from '@apollo/client';
import { TARGET_USER_FRAGMENT } from '../../fragments';
import {
  readTripsQuery,
  readTripsQueryVariables,
} from '../../__generated__/readTripsQuery';

const READ_TRIPS_QUERY = gql`
  query readTripsQuery($input: ReadTripsInput!) {
    readTrips(input: $input) {
      ok
      error
      targetUser {
        ...TargetUserParts
      }
    }
  }
  ${TARGET_USER_FRAGMENT}
`;

// useQuery makes warnings under strict mode. That is why this is useLazyQuery.
// see https://github.com/apollographql/react-apollo/issues/3635, https://github.com/apollographql/apollo-client/issues/7404
export const useLazyTrips = () => {
  return useLazyQuery<readTripsQuery, readTripsQueryVariables>(
    READ_TRIPS_QUERY,
  );
};
