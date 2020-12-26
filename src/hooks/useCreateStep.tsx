import { gql, useMutation } from '@apollo/client';
import { UseFormMethods } from 'react-hook-form';
import { client } from '../apollo';
import {
  ICreateStepFormProps,
  IImagesState,
} from '../components/Modals/Create-step';
import { READ_TRIP_QUERY } from '../pages/Trip';
import {
  createStepMutation,
  createStepMutationVariables,
} from '../__generated__/createStepMutation';
import {
  readTripQuery_readTrip_trip_steps_images,
  readTripQuery,
  readTripQueryVariables,
} from '../__generated__/readTripQuery';
import { useCreateImage } from './useCreateImage';

const CREATE_STEP_MUTAION = gql`
  mutation createStepMutation($input: CreateStepInput!) {
    createStep(input: $input) {
      ok
      error
      createdStepId
    }
  }
`;

export const useCreateStep = (
  f: UseFormMethods<ICreateStepFormProps>,
  tripId: string,
  images: IImagesState[],
  setIsCreateStepModal: (value: React.SetStateAction<boolean>) => void,
) => {
  const [createImageMutation] = useCreateImage();

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
                ...prevQuery.readTrip.trip!.steps,
              ],
            },
          },
        },
      });
  };
  const onCreateStepCompleted = async (data: createStepMutation) => {
    const {
      createStep: { ok, error, createdStepId },
    } = data;
    if (ok && !error && createdStepId) {
      if (images.length !== 0 && images.some((image) => image.url)) {
        const urls: string[] = [];
        images.forEach((image) => image.url && urls.push(image.url));
        const { data, errors } = await createImageMutation({
          variables: {
            input: { stepId: createdStepId, urls },
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
        updateApolloCache(createdStepId);
        setIsCreateStepModal(false);
      }
    }
  };
  return useMutation<createStepMutation, createStepMutationVariables>(
    CREATE_STEP_MUTAION,
    { onCompleted: onCreateStepCompleted },
  );
};
