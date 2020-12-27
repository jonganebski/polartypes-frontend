import { gql, useMutation } from '@apollo/client';
import { UseFormMethods } from 'react-hook-form';
import { client } from '../apollo';
import {
  ICreateStepFormProps,
  IImagesState,
} from '../components/Modals/Create-step';
import { READ_TRIP_QUERY } from '../pages/Trip';
import {
  readTripQuery,
  readTripQueryVariables,
  readTripQuery_readTrip_trip_steps,
  readTripQuery_readTrip_trip_steps_images,
} from '../__generated__/readTripQuery';
import {
  updateStepMutation,
  updateStepMutationVariables,
} from '../__generated__/updateStepMutation';
import { useCreateImage } from './useCreateImage';
import { useDeleteImage } from './useDeleteImage';

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
  tripId: string,
  images: IImagesState[],
  editingStep: readTripQuery_readTrip_trip_steps | null,
  setIsCreateStepModal: (value: React.SetStateAction<boolean>) => void,
) => {
  const [createImageMutation] = useCreateImage();
  const [deleteImageMutation] = useDeleteImage();

  const updateApolloCache = (
    stepId: number,
    imagesState: IImagesState[] = [],
  ) => {
    const { lat, lon } = f.getValues();
    const images: readTripQuery_readTrip_trip_steps_images[] = [];
    imagesState.forEach(
      (state) =>
        state.url &&
        images.push({
          __typename: state.__typename,
          url: state.url,
        }),
    );
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
                {
                  ...f.getValues(),
                  __typename: 'Step',
                  id: stepId,
                  lat: +lat,
                  lon: +lon,
                  likes: [],
                  comments: [],
                  images,
                },
                ...prevQuery.readTrip.trip!.steps.filter(
                  (step) => step.id !== stepId,
                ),
              ],
            },
          },
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
    const newImages = images.filter(
      (image) =>
        image.url &&
        !editingStep?.images.includes({
          __typename: 'Image',
          url: image.url,
        }),
    );
    const deletedImages = editingStep!.images.filter(
      (image) => !images.includes({ __typename: 'Image', url: image.url }),
    );
    if (deletedImages.length !== 0) {
      const urls: string[] = [];
      deletedImages.forEach((image) => image.url && urls.push(image.url));
      await deleteImageMutation({
        variables: { input: { stepId: editingStep!.id, urls } },
      });
    }
    if (newImages.length !== 0) {
      const urls: string[] = [];
      newImages.forEach((image) => image.url && urls.push(image.url));
      const { data, errors } = await createImageMutation({
        variables: {
          input: { stepId: editingStep!.id, urls },
        },
      });
      if (data && !errors) {
        const {
          createImage: { ok, error, stepId },
        } = data;
        if (ok && !error && stepId) {
          updateApolloCache(stepId, images);
          setIsCreateStepModal(false);
        }
      }
    } else {
      updateApolloCache(editingStep!.id);
      setIsCreateStepModal(false);
    }
  };

  return useMutation<updateStepMutation, updateStepMutationVariables>(
    UPDATE_STEP_MUTATION,
    { onCompleted: onUpdateStepCompleted },
  );
};
