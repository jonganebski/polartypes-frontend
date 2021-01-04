import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { client } from '../../apollo';
import { TImage } from '../../components/Modals/Save-step';
import { ICreateStepFormProps } from '../../pages/Trip';
import {
  createStepMutation,
  createStepMutationVariables,
} from '../../__generated__/createStepMutation';
import {
  readTripQuery,
  readTripQueryVariables,
} from '../../__generated__/readTripQuery';
import { READ_TRIP_QUERY } from '../useQuery/useTrip';
import { useWhoAmI } from '../useQuery/useWhoAmI';

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
  const [lazyWhoAmIQuery, { data: userData }] = useWhoAmI();
  useEffect(() => {
    lazyWhoAmIQuery();
  }, [lazyWhoAmIQuery]);
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
      userData &&
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
                  traveler: {
                    __typename: 'Users',
                    id: userData.whoAmI.id,
                  },
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
