import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { STEPS_FRAGMENTS, TRAVELER_FRAGMENT } from '../../fragments';
import {
  readTripQuery,
  readTripQueryVariables,
} from '../../__generated__/readTripQuery';

export const READ_TRIP_QUERY = gql`
  query readTripQuery($input: ReadTripInput!) {
    readTrip(input: $input) {
      ok
      error
      trip {
        id
        name
        startDate
        endDate
        coverUrl
        summary
        viewCount
        availability
        traveler {
          ...TravelerParts
        }
        steps {
          ...StepParts
        }
      }
    }
  }
  ${TRAVELER_FRAGMENT}
  ${STEPS_FRAGMENTS}
`;

export const useTrip = (tripId: string) => {
  return useQuery<readTripQuery, readTripQueryVariables>(READ_TRIP_QUERY, {
    variables: { input: { tripId: +tripId } },
  });
};

export const useLazyTrip = () => {
  return useLazyQuery<readTripQuery, readTripQueryVariables>(READ_TRIP_QUERY);
};
