import { gql, useLazyQuery } from '@apollo/client';
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

// useQuery makes warnings under strict mode. That is why this is useLazyQuery.
// see https://github.com/apollographql/react-apollo/issues/3635, https://github.com/apollographql/apollo-client/issues/7404
export const useLazyTrip = () => {
  return useLazyQuery<readTripQuery, readTripQueryVariables>(READ_TRIP_QUERY);
};
