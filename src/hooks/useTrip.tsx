import { gql, useLazyQuery, useQuery } from '@apollo/client';
import {
  readTripQuery,
  readTripQueryVariables,
} from '../__generated__/readTripQuery';

export const READ_TRIP_QUERY = gql`
  query readTripQuery($input: ReadTripInput!) {
    readTrip(input: $input) {
      ok
      error
      trip {
        startDate
        endDate
        coverUrl
        viewCount
        traveler {
          id
          username
          firstName
          lastName
          avatarUrl
          timeZone
          followers {
            id
          }
        }
        steps {
          id
          name
          location
          country
          arrivedAt
          timeZone
          lat
          lon
          story
          imgUrls
          traveler {
            id
          }
          likes {
            user {
              username
              avatarUrl
            }
          }
          comments {
            id
            createdAt
            text
            creator {
              id
              username
              avatarUrl
            }
          }
        }
      }
    }
  }
`;

export const useTrip = (tripId: string) => {
  return useQuery<readTripQuery, readTripQueryVariables>(READ_TRIP_QUERY, {
    variables: { input: { tripId: +tripId } },
  });
};

export const useLazyTrip = () => {
  return useLazyQuery<readTripQuery, readTripQueryVariables>(READ_TRIP_QUERY);
};
