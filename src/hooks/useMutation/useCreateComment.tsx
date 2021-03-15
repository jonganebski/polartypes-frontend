import { gql, useApolloClient, useMutation } from '@apollo/client';
import {
  createCommentMutation,
  createCommentMutationVariables,
} from '../../__generated__/createCommentMutation';
import { listCommentsQuery_listComments_step_comments } from '../../__generated__/listCommentsQuery';

import { USER_FRAGMENT } from '../../fragments';
import { whoAmIQuery } from '../../__generated__/whoAmIQuery';

const CREATE_COMMENT_MUTAION = gql`
  mutation createCommentMutation($input: CreateCommentInput!) {
    createComment(input: $input) {
      ok
      error
      commentId
    }
  }
`;

export const useCreateComment = (
  text: string,
  stepId: number,
  userData: whoAmIQuery | undefined,
) => {
  const client = useApolloClient();

  const onCreateCommentCompleted = (data: createCommentMutation) => {
    const {
      createComment: { ok, error, commentId },
    } = data;
    if (ok && !error && commentId && userData) {
      const commentRef = client.cache.writeFragment<listCommentsQuery_listComments_step_comments>(
        {
          id: `Comment:${commentId}`,
          fragmentName: 'CreatedComment',
          fragment: gql`
            fragment CreatedComment on Comment {
              createdAt
              creator {
                ...UserParts
              }
              text
              id
            }
            ${USER_FRAGMENT}
          `,
          data: {
            creator: { ...userData.whoAmI },
            createdAt: 'Just now',
            __typename: 'Comment',
            id: commentId,
            text,
          },
        },
      );
      if (commentRef) {
        client.cache.modify({
          id: `Step:${stepId}`,
          fields: {
            comments: (prev) => [commentRef, ...prev],
            countComments: (prev) => ++prev,
          },
        });
      }
    }
  };

  return useMutation<createCommentMutation, createCommentMutationVariables>(
    CREATE_COMMENT_MUTAION,
    { onCompleted: onCreateCommentCompleted },
  );
};
