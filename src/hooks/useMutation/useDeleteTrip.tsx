import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { client } from '../../apollo/apollo';
import {
  deleteTripMutation,
  deleteTripMutationVariables,
} from '../../__generated__/deleteTripMutation';
import { useWhoAmI } from '../useQuery/useWhoAmI';

const DELETE_TRIP_MUTATION = gql`
  mutation deleteTripMutation($input: DeleteTripInput!) {
    deleteTrip(input: $input) {
      ok
      error
    }
  }
`;

export const useDeleteTrip = (tripId?: number) => {
  const { me } = useWhoAmI();
  const history = useHistory();

  const onCompleted = (data: deleteTripMutation) => {
    const {
      deleteTrip: { ok, error },
    } = data;
    if (ok && !error && me && tripId) {
      client.cache.evict({ id: `Trip:${tripId}` });
      history.push(`/${me.username}`);
    }
  };

  return useMutation<deleteTripMutation, deleteTripMutationVariables>(
    DELETE_TRIP_MUTATION,
    { onCompleted },
  );
};
