import { gql, useMutation } from '@apollo/client';
import { client } from '../../apollo';
import {
  followMutation,
  followMutationVariables,
} from '../../__generated__/followMutation';
import { targetUser } from '../../__generated__/targetUser';
import { useWhoAmI } from '../useQuery/useWhoAmI';

const FOLLOW_MUTAION = gql`
  mutation followMutation($input: FollowInput!) {
    follow(input: $input) {
      ok
      error
    }
  }
`;

export const useFollow = (targetUserId?: number) => {
  const { data: userData } = useWhoAmI();
  const onCompleted = (data: followMutation) => {
    const {
      follow: { ok, error },
    } = data;
    console.log(ok, error);
    if (ok && !error && targetUserId && userData) {
      const targetUser = client.readFragment<targetUser>({
        id: `Users:${targetUserId}`,
        fragment: gql`
          fragment targetUser on Users {
            followers {
              id
            }
          }
        `,
      });
      targetUser &&
        client.writeFragment<targetUser>({
          id: `Users:${targetUserId}`,
          fragment: gql`
            fragment targetUser on Users {
              followers {
                id
              }
            }
          `,
          data: {
            __typename: 'Users',
            followers: [
              ...targetUser?.followers,
              { __typename: 'Users', id: userData.whoAmI.id },
            ],
          },
        });
    }
  };

  return useMutation<followMutation, followMutationVariables>(FOLLOW_MUTAION, {
    onCompleted,
  });
};
