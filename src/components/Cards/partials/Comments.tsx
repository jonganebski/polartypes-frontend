import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { client } from '../../../apollo/apollo';
import {
  createCommentMutation,
  createCommentMutationVariables,
} from '../../../__generated__/createCommentMutation';
import { readTripQuery_readTrip_trip_steps } from '../../../__generated__/readTripQuery';
import { stepComments } from '../../../__generated__/stepComments';
import { whoAmIQuery } from '../../../__generated__/whoAmIQuery';
import { Avatar } from '../../Avatar';
import { Comment } from './Comment';

const CREATE_COMMENT_MUTAION = gql`
  mutation createCommentMutation($input: CreateCommentInput!) {
    createComment(input: $input) {
      ok
      error
      commentId
    }
  }
`;

interface ICommentProps {
  userData: whoAmIQuery | undefined;
  step: readTripQuery_readTrip_trip_steps;
}

export const Comments: React.FC<ICommentProps> = ({ userData, step }) => {
  const { register, getValues, handleSubmit, reset } = useForm<{
    text: string;
  }>();
  const onCreateCommentCompleted = (data: createCommentMutation) => {
    const {
      createComment: { ok, error, commentId },
    } = data;
    if (ok && !error && commentId) {
      const { text } = getValues();
      const prevStep = client.readFragment<stepComments>({
        id: `Step:${step.id}`,
        fragment: gql`
          fragment stepComments on Step {
            comments {
              id
              createdAt
              text
              creator {
                slug
                username
                avatarUrl
              }
            }
          }
        `,
      });
      if (prevStep && userData) {
        client.writeFragment<stepComments>({
          id: `Step:${step.id}`,
          fragment: gql`
            fragment stepComments on Step {
              comments {
                id
                createdAt
                text
                creator {
                  slug
                  username
                  avatarUrl
                }
              }
            }
          `,
          data: {
            __typename: 'Step',
            comments: [
              {
                __typename: 'Comment',
                id: commentId,
                createdAt: 'Just now',
                text,
                creator: {
                  __typename: 'Users',
                  slug: userData.whoAmI.slug,
                  username: userData.whoAmI.username,
                  avatarUrl: userData.whoAmI.avatarUrl,
                },
              },
              ...prevStep.comments,
            ],
          },
        });
      }
      reset();
    }
  };

  const [createCommentMutation, { loading }] = useMutation<
    createCommentMutation,
    createCommentMutationVariables
  >(CREATE_COMMENT_MUTAION, { onCompleted: onCreateCommentCompleted });

  const onSubmit = () => {
    if (!loading) {
      const { text } = getValues();
      createCommentMutation({
        variables: { input: { text, stepId: step.id } },
      });
    }
  };

  return (
    <div className="py-4 border-t border-myGray-light">
      {userData && (
        <form className="flex items-center" onSubmit={handleSubmit(onSubmit)}>
          <Avatar avatarUrl={userData.whoAmI.avatarUrl} size={8} />
          <input
            ref={register({ required: true })}
            name="text"
            type="text"
            className="input ml-3 w-full"
            placeholder="Write a comment..."
          />
        </form>
      )}
      <ul className="py-4 grid gap-y-4">
        {step.comments
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((comment, i) => (
            <Comment key={i} userData={userData} comment={comment} />
          ))}
      </ul>
    </div>
  );
};
