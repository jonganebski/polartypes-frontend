import { gql, Reference, useApolloClient, useMutation } from '@apollo/client';
import { UseFormMethods } from 'react-hook-form';
import { TImage } from '../../components/Modals/Save-step';
import { STEPS_FRAGMENTS } from '../../fragments';
import { ICreateStepFormProps } from '../../pages/Trip';
import {
  createStepMutation,
  createStepMutationVariables,
} from '../../__generated__/createStepMutation';
import { readTripQuery_readTrip_trip_steps } from '../../__generated__/readTripQuery';
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
  const { data: userData } = useWhoAmI();
  const client = useApolloClient();

  const updateApolloCache = (stepId: number) => {
    if (!userData) {
      return;
    }
    const { lat, lon, ...values } = f.getValues();
    const imgUrls = images.reduce((acc, img) => {
      if (img.url) {
        return [...acc, img.url];
      } else {
        return acc;
      }
    }, [] as string[]);
    const stepRef = client.cache.writeFragment<readTripQuery_readTrip_trip_steps>(
      {
        id: `Step:${stepId}`,
        fragmentName: 'CreatedStep',
        fragment: gql`
          fragment CreatedStep on Step {
            ...StepParts
          }
          ${STEPS_FRAGMENTS}
        `,
        data: {
          id: stepId,
          __typename: 'Step',
          lat: +lat,
          lon: +lon,
          imgUrls,
          likes: [],
          countComments: 0,
          traveler: { ...userData.whoAmI },
          ...values,
        },
      },
    );
    if (stepRef) {
      client.cache.modify({
        id: `Trip:${tripId}`,
        fields: {
          steps: (prev) => [stepRef, ...prev],
        },
      });
    }
    // const prevQuery = client.readQuery<readTripQuery, readTripQueryVariables>({
    //   query: READ_TRIP_QUERY,
    //   variables: { input: { tripId: +tripId } },
    // });
    // prevQuery &&
    //   userData &&
    //   client.writeQuery<readTripQuery, readTripQueryVariables>({
    //     query: READ_TRIP_QUERY,
    //     variables: { input: { tripId: +tripId } },
    //     data: {
    //       readTrip: {
    //         ...prevQuery.readTrip,
    //         trip: {
    //           ...prevQuery.readTrip.trip!,
    //           steps: [
    //             {
    //               ...values,
    //               __typename: 'Step',
    //               id: stepId,
    //               lat: +lat,
    //               lon: +lon,
    //               imgUrls,
    //               traveler: {
    //                 __typename: 'Users',
    //                 isMe: true,
    //                 slug: userData.whoAmI.slug,
    //               },
    //               likes: [],
    //               countComments:
    //             },
    //             ...prevQuery.readTrip.trip!.steps,
    //           ],
    //         },
    //       },
    //     },
    //   });
  };
  const onCreateStepCompleted = async (data: createStepMutation) => {
    const {
      createStep: { ok, error, createdStepId },
    } = data;
    if (ok && !error && createdStepId && userData) {
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
