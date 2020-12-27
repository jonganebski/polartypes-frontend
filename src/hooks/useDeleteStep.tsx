import { gql, useMutation } from '@apollo/client';
import { client } from '../apollo';
import { IImagesState } from '../components/Modals/Create-step';
import { deleteFiles } from '../helpers';
import { READ_TRIP_QUERY } from '../pages/Trip';
import {
  deleteStepMutation,
  deleteStepMutationVariables,
} from '../__generated__/deleteStepMutation';
import {
  readTripQuery,
  readTripQueryVariables,
} from '../__generated__/readTripQuery';

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
  tripId: string,
  images: IImagesState[],
  setIsCreateStepModal: (value: React.SetStateAction<boolean>) => void,
) => {
  const onDeleteStepCompleted = (data: deleteStepMutation) => {
    const {
      deleteStep: { ok, error, stepId },
    } = data;
    if (!ok || error || !stepId) {
      return;
    }
    const prevQuery = client.readQuery<readTripQuery, readTripQueryVariables>({
      query: READ_TRIP_QUERY,
      variables: { input: { tripId: +tripId } },
    });
    prevQuery &&
      client.writeQuery<readTripQuery, readTripQueryVariables>({
        query: READ_TRIP_QUERY,
        variables: { input: { tripId: +tripId } },
        data: {
          readTrip: {
            ...prevQuery.readTrip,
            trip: {
              ...prevQuery.readTrip.trip!,
              steps: [
                ...prevQuery.readTrip.trip!.steps.filter(
                  (step) => step.id !== stepId,
                ),
              ],
            },
          },
        },
      });
    const urls: string[] = [];
    images.forEach((image) => {
      if (image.url) {
        urls.push(image.url);
      }
    });
    deleteFiles(urls);
    setIsCreateStepModal(false);
  };

  return useMutation<deleteStepMutation, deleteStepMutationVariables>(
    DELETE_STEP_MUTATION,
    { onCompleted: onDeleteStepCompleted },
  );
};
