import { gql, useMutation } from '@apollo/client';
import { UseFormMethods } from 'react-hook-form';
import { client } from '../../apollo';
import { TImage } from '../../components/Modals/Save-step';
import { deleteFiles } from '../../helpers';
import { ICreateStepFormProps } from '../../pages/Trip';
import {
  deleteStepMutation,
  deleteStepMutationVariables,
} from '../../__generated__/deleteStepMutation';
import {
  readTripQuery,
  readTripQueryVariables,
} from '../../__generated__/readTripQuery';
import { READ_TRIP_QUERY } from '../useQuery/useTrip';

const DELETE_STEP_MUTATION = gql`
  mutation deleteStepMutation($input: DeleteStepInput!) {
    deleteStep(input: $input) {
      ok
      error
      stepId
    }
  }
`;

export const useDeleteStep = (
  f: UseFormMethods<ICreateStepFormProps>,
  tripId: string,
  images: TImage[],
  setIsCreateStepModal: (value: React.SetStateAction<boolean>) => void,
) => {
  const onDeleteStepCompleted = (data: deleteStepMutation) => {
    const {
      deleteStep: { ok, error, stepId },
    } = data;
    if (!ok || error || !stepId) {
      return;
    }
    client.cache.evict({ id: `Step:${stepId}` });
    const imgUrls = images.reduce((acc, img) => {
      if (img.url) {
        return [...acc, img.url];
      } else {
        return acc;
      }
    }, [] as string[]);
    deleteFiles(imgUrls);
    setIsCreateStepModal(false);
  };

  return useMutation<deleteStepMutation, deleteStepMutationVariables>(
    DELETE_STEP_MUTATION,
    { onCompleted: onDeleteStepCompleted },
  );
};
