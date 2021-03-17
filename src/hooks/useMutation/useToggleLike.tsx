import { gql, useApolloClient, useMutation } from '@apollo/client';
import { LIKE_FRAGMENT } from '../../fragments';
import { readTripQuery_readTrip_trip_steps_likesInfo_samples } from '../../__generated__/readTripQuery';
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
  const { me } = useWhoAmI();
  const client = useApolloClient();

  const writeLikeCache = () => {
    if (!me) return;

    const likeRef = client.cache.writeFragment<readTripQuery_readTrip_trip_steps_likesInfo_samples>(
      {
        id: `Like:${stepId}:${me.id}`,
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
          userId: me.id,
          user: {
            username: me.username,
            avatarUrl: me.avatarUrl,
            slug: me.slug,
            __typename: 'Users',
          },
        },
      },
    );
    if (likeRef) {
      client.cache.modify({
        id: `Step:${stepId}`,
        fields: {
          likesInfo: ({ totalCount: prevTotalCount }) => ({
            totalCount: ++prevTotalCount,
          }),
          didILiked: () => true,
        },
      });
    }
  };

  const eraseLikeCache = () => {
    if (!me) return;

    client.cache.evict({ id: `Like:${stepId}:${me.id}` });
    client.cache.modify({
      id: `Step:${stepId}`,
      fields: {
        likesInfo: ({ totalCount: prevTotalCount }) => ({
          totalCount: --prevTotalCount,
        }),
        didILiked: () => false,
      },
    });
  };

  const onCompleted = (data: toggleLikeMutation) => {
    const {
      toggleLike: { ok, error, toggle },
    } = data;
    if (ok && !error && toggle && me) {
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
