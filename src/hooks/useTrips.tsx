import { gql, useLazyQuery, useQuery } from '@apollo/client';
import {
  readTripsQuery,
  readTripsQueryVariables,
} from '../__generated__/readTripsQuery';

const READ_TRIPS_QUERY = gql`
  query readTripsQuery($input: ReadTripsInput!) {
    readTrips(input: $input) {
      ok
      error
      targetUser {
        username
        firstName
        lastName
        about
        city
        avatarUrl
        followers {
          id
        }
        followings {
          id
        }
        trips {
          id
          name
          startDate
          endDate
          steps {
            id
            lat
            lon
            arrivedAt
          }
        }
      }
    }
  }
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
