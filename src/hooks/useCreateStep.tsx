import { gql, useMutation } from '@apollo/client';
import { UseFormMethods } from 'react-hook-form';
import { client } from '../apollo';
import { ICreateStepFormProps, TImage } from '../components/Modals/Create-step';
import { READ_TRIP_QUERY } from '../pages/Trip';
import {
  createStepMutation,
  createStepMutationVariables,
} from '../__generated__/createStepMutation';
import {
  readTripQuery,
  readTripQueryVariables,
} from '../__generated__/readTripQuery';

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
  images: TImage[],
  setIsCreateStepModal: (value: React.SetStateAction<boolean>) => void,
) => {
  const updateApolloCache = (stepId: number) => {
    const { lat, lon, ...values } = f.getValues();
    const imgUrls = images.reduce((acc, img) => {
      if (img.url) {
        return [...acc, img.url];
      } else {
        return acc;
      }
    }, [] as string[]);
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
                  ...values,
                  __typename: 'Step',
                  id: stepId,
                  lat: +lat,
                  lon: +lon,
                  imgUrls,
                  likes: [],
                  comments: [],
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
      updateApolloCache(createdStepId);
      setIsCreateStepModal(false);
    } else {
      console.log(error);
    }
  };

  return useMutation<createStepMutation, createStepMutationVariables>(
    CREATE_STEP_MUTAION,
    { onCompleted: onCreateStepCompleted },
  );
};
