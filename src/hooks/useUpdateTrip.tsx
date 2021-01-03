import { gql, useMutation } from '@apollo/client';
import { useFormContext, UseFormMethods } from 'react-hook-form';
import { client } from '../apollo';
import { ISaveTripFormProps } from '../components/Modals/Create-trip';
import { readTripQuery_readTrip_trip } from '../__generated__/readTripQuery';
import {
  updateTripMutation,
  updateTripMutationVariables,
} from '../__generated__/updateTripMutation';

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
  const onCompleted = (data: updateTripMutation) => {
    const {
      updateTrip: { ok, error },
    } = data;
    if (ok && !error && editingTrip) {
      client.writeFragment({
        id: `Trip:${editingTrip.id}`,
        fragment: gql`
          fragment UPDATED_TRIP_FRAGMENT on Trip {
            name
            startDate
            endDate
            availability
            coverUrl
            summary
          }
        `,
        data: { ...f.getValues(), coverUrl },
      });
    }
  };
  return useMutation<updateTripMutation, updateTripMutationVariables>(
    UPDATE_TRIP_MUTATION,
    { onCompleted },
  );
};
