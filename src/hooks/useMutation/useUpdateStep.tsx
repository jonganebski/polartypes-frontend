import { ApolloCache, FetchResult, gql, useMutation } from '@apollo/client';
import { UseFormMethods } from 'react-hook-form';
import { client } from '../../apollo/apollo';
import { TImage } from '../../components/Modals/Save-step';
import { UPDATED_STEP_FRAGMENT } from '../../fragments';
import { ICreateStepFormProps } from '../../pages/Trip';
import { readTripQuery_readTrip_trip_steps } from '../../__generated__/readTripQuery';
import {
  updateStepMutation,
  updateStepMutationVariables,
} from '../../__generated__/updateStepMutation';

const UPDATE_STEP_MUTATION = gql`
  mutation updateStepMutation($input: UpdateStepInput!) {
    updateStep(input: $input) {
      ok
      error
    }
  }
`;

export const useUpdateStep = (
  f: UseFormMethods<ICreateStepFormProps>,
  editingStep: readTripQuery_readTrip_trip_steps | null,
  images: TImage[],
  setIsCreateStepModal: (value: React.SetStateAction<boolean>) => void,
) => {
  const update = (
    cache: ApolloCache<updateStepMutation>,
    { data }: FetchResult<updateStepMutation>,
  ) => {
    if (!data || !editingStep) return;

    const {
      updateStep: { error, ok },
    } = data;
    if (!ok) {
      console.log(error);
      return;
    }
    const { lat, lon, ...values } = f.getValues();

    const success = cache.modify({
      id: `Step:${editingStep.id}`,
      fields: {
        lat: () => +lat,
        lon: () => +lon,
        location: () => values.location,
        name: () => values.name,
        country: () => values.country,
        story: () => values.story,
        arrivedAt: () => values.arrivedAt,
        timeZone: () => values.timeZone,
      },
    });

    if (!success) return;

    setIsCreateStepModal(false);
  };

  return useMutation<updateStepMutation, updateStepMutationVariables>(
    UPDATE_STEP_MUTATION,
    { update },
  );
};
