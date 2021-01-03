import { gql, useLazyQuery, useQuery } from '@apollo/client';
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

export const useTrips = (targetUsername: string) => {
  return useQuery<readTripsQuery, readTripsQueryVariables>(READ_TRIPS_QUERY, {
    variables: { input: { targetUsername: targetUsername.toLowerCase() } },
  });
};

export const useLazyTrips = () => {
  return useLazyQuery<readTripsQuery, readTripsQueryVariables>(
    READ_TRIPS_QUERY,
  );
};
