import { gql, useMutation } from '@apollo/client';
import { UseFormMethods } from 'react-hook-form';
import { client } from '../apollo';
import { ICreateStepFormProps, TImage } from '../components/Modals/Create-step';
import { readTripQuery_readTrip_trip_steps } from '../__generated__/readTripQuery';
import {
  updateStepMutation,
  updateStepMutationVariables,
} from '../__generated__/updateStepMutation';

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
        fragment: gql`
          fragment updatedStep on Step {
            location
            lat
            lon
            name
            country
            arrivedAt
            timeZone
            story
            imgUrls
          }
        `,
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
