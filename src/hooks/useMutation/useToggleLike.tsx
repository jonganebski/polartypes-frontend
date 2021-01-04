import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { client } from '../../apollo';
import { toggledLikeStep } from '../../__generated__/toggledLikeStep';
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
  const [lazyWhoAmIQuery, { data: userData }] = useWhoAmI();
  useEffect(() => {
    lazyWhoAmIQuery();
  }, [lazyWhoAmIQuery]);
  const onCompleted = (data: toggleLikeMutation) => {
    const {
      toggleLike: { ok, error, toggle },
    } = data;
    if (ok && !error && toggle) {
      const prevStep = client.readFragment<toggledLikeStep>({
        id: `Step:${stepId}`,
        fragment: gql`
          fragment toggledLikeStep on Step {
            likes {
              user {
                username
              }
            }
          }
        `,
      });
      if (prevStep && userData) {
        const username = userData.whoAmI.username;
        let likes = prevStep?.likes.slice();
        console.log(likes);
        if (0 < toggle) {
          likes.unshift({
            __typename: 'Like',
            user: { __typename: 'Users', username },
          });
        } else {
          likes = likes.filter((like) => like.user.username !== username);
        }
        client.writeFragment<toggledLikeStep>({
          id: `Step:${stepId}`,
          fragment: gql`
            fragment toggledLikeStep on Step {
              likes {
                user {
                  username
                }
              }
            }
          `,
          data: {
            __typename: 'Step',
            likes,
          },
        });
      }
    }
  };

  return useMutation<toggleLikeMutation, toggleLikeMutationVariables>(
    TOGGLE_LIKE_MUTATION,
    { onCompleted },
  );
};
