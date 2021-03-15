import { gql, Reference, useApolloClient, useMutation } from '@apollo/client';
import { LIKE_FRAGMENT } from '../../fragments';
import { readTripQuery_readTrip_trip_steps_likes } from '../../__generated__/readTripQuery';
import {
  toggleLikeMutation,
  toggleLikeMutationVariables,
} from '../../__generated__/toggleLikeMutation';
import { useWhoAmI } from '../useQuery/useWhoAmI';

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLikeMutation($input: ToggleLikeInput!) {
    toggleLike(input: $input) {
      ok
      error
      toggle
    }
  }
`;

export const useToggleLike = (stepId: number) => {
  const { data: userData } = useWhoAmI();
  const client = useApolloClient();

  const writeLikeCache = () => {
    if (!userData) return;

    const likeRef = client.cache.writeFragment<readTripQuery_readTrip_trip_steps_likes>(
      {
        id: `Like:${stepId}:${userData.whoAmI.id}`,
        fragmentName: 'ToggleLike',
        fragment: gql`
          fragment ToggleLike on Like {
            ...LikeParts
          }
          ${LIKE_FRAGMENT}
        `,
        data: {
          __typename: 'Like',
          stepId,
          userId: userData.whoAmI.id,
          user: {
            username: userData.whoAmI.username,
            avatarUrl: userData.whoAmI.avatarUrl,
            slug: userData.whoAmI.slug,
            __typename: 'Users',
          },
        },
      },
    );
    if (likeRef) {
      client.cache.modify({
        id: `Step:${stepId}`,
        fields: {
          likes: (prev) => [likeRef, ...prev],
        },
      });
    }
  };

  const eraseLikeCache = () => {
    if (!userData) return;

    client.cache.evict({ id: `Like:${stepId}:${userData.whoAmI.id}` });
    client.cache.modify({
      id: `Step:${stepId}`,
      fields: {
        likes: (prev) =>
          prev.filter(
            (like: Reference) =>
              like.__ref !== `Like:${stepId}:${userData.whoAmI.id}`,
          ),
      },
    });
  };

  const onCompleted = (data: toggleLikeMutation) => {
    const {
      toggleLike: { ok, error, toggle },
    } = data;
    if (ok && !error && toggle && userData) {
      if (0 < toggle) {
        writeLikeCache();
      }
      if (toggle < 0) {
        eraseLikeCache();
      }
    }
  };

  return useMutation<toggleLikeMutation, toggleLikeMutationVariables>(
    TOGGLE_LIKE_MUTATION,
    { onCompleted },
  );
};
