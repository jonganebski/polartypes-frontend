import { gql, useApolloClient, useMutation } from '@apollo/client';
import { useHistory } from 'react-router';
import {
  createTripMutation,
  createTripMutationVariables,
} from '../../__generated__/createTripMutation';

const CREATE_TRIP_MUTATION = gql`
  mutation createTripMutation($input: CreateTripInput!) {
    createTrip(input: $input) {
      ok
      error
      tripId
    }
  }
`;

export const useCreateTrip = (username: string) => {
  const history = useHistory();
  const client = useApolloClient();
  const onCompleted = (data: createTripMutation) => {
    const {
      createTrip: { ok, error, tripId },
    } = data;
    if (ok && tripId && !error) {
      client.cache.modify({
        id: `User:${username.toLowerCase()}`,
        fields: {
          trips: (prev) => [...prev, { __ref: `Trip:${tripId}` }],
        },
      });
      history.push(`/${username}/${tripId}`);
    }
  };
  return useMutation<createTripMutation, createTripMutationVariables>(
    CREATE_TRIP_MUTATION,
    { onCompleted },
  );
};
