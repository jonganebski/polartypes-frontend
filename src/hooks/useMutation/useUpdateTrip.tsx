import { ApolloCache, FetchResult, gql, useMutation } from '@apollo/client';
import { UseFormMethods } from 'react-hook-form';
import { ISaveTripFormProps } from '../../components/Modals/Save-trip';
import { readTripQuery_readTrip_trip } from '../../__generated__/readTripQuery';
import {
  updateTripMutation,
  updateTripMutationVariables,
} from '../../__generated__/updateTripMutation';

const UPDATE_TRIP_MUTATION = gql`
  mutation updateTripMutation($input: UpdateTripInput!) {
    updateTrip(input: $input) {
      ok
      error
    }
  }
`;

export const useUpdateTrip = (
  f: UseFormMethods<ISaveTripFormProps>,
  editingTrip: readTripQuery_readTrip_trip | null,
  coverUrl: string,
) => {
  const update = (
    cache: ApolloCache<updateTripMutation>,
    { data }: FetchResult<updateTripMutation>,
  ) => {
    if (!data || !editingTrip) return;

    const {
      updateTrip: { error, ok },
    } = data;

    if (!ok) {
      console.log(error);
      return;
    }

    const values = f.getValues();

    cache.modify({
      id: `Trip:${editingTrip.id}`,
      fields: {
        availability: () => values.availability,
        coverUrl: () => coverUrl,
        endDate: () => values.endDate,
        name: () => values.name,
        startDate: () => values.startDate,
        summary: () => values.summary,
      },
    });
  };

  return useMutation<updateTripMutation, updateTripMutationVariables>(
    UPDATE_TRIP_MUTATION,
    { update },
  );
};
