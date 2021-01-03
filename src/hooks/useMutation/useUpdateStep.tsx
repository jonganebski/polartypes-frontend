import { gql, useMutation } from '@apollo/client';
import { UseFormMethods } from 'react-hook-form';
import { client } from '../../apollo';
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
  const updateApolloCache = () => {
    const { lat, lon, ...values } = f.getValues();
    const imgUrls = images.reduce((acc, img) => {
      if (img.url) {
        return [...acc, img.url];
      } else {
        return acc;
      }
    }, [] as string[]);
    editingStep &&
      client.writeFragment({
        id: `Step:${editingStep.id}`,
        fragment: UPDATED_STEP_FRAGMENT,
        data: {
          ...values,
          lat: +lat,
          lon: +lon,
          imgUrls,
        },
      });
  };

  const onUpdateStepCompleted = async (data: updateStepMutation) => {
    const {
      updateStep: { ok, error },
    } = data;
    if (!ok || error) {
      return;
    }
    updateApolloCache();
    setIsCreateStepModal(false);
  };

  return useMutation<updateStepMutation, updateStepMutationVariables>(
    UPDATE_STEP_MUTATION,
    { onCompleted: onUpdateStepCompleted },
  );
};
