import React from 'react';
import { Link } from 'react-router-dom';
import {
  readTripQuery_readTrip_trip_steps,
  readTripQuery_readTrip_trip_steps_comments,
} from '../../../__generated__/readTripQuery';
import { Avatar } from '../../Avatar';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { useWhoAmI } from '../../../hooks/useWhoAmI';
import { gql, useMutation } from '@apollo/client';
import {
  deleteCommentMutation,
  deleteCommentMutationVariables,
} from '../../../__generated__/deleteCommentMutation';
import { client } from '../../../apollo';
import { stepComments } from '../../../__generated__/stepComments';

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteCommentMutation($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      ok
      error
    }
  }
`;

interface ICommentProps {
  step: readTripQuery_readTrip_trip_steps;
  comment: readTripQuery_readTrip_trip_steps_comments;
}

export const Comment: React.FC<ICommentProps> = ({ step, comment }) => {
  const { data: userData } = useWhoAmI();

  const onCompleted = (data: deleteCommentMutation) => {
    const {
      deleteComment: { ok, error },
    } = data;
    if (ok && !error) {
      const prevStep = client.readFragment<stepComments>({
        id: `Step:${step.id}`,
        fragment: gql`
          fragment stepComments on Step {
            comments {
              id
              createdAt
              text
              creator {
                id
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
                  id
                  username
                  avatarUrl
                }
              }
            }
          `,
          data: {
            __typename: 'Step',
            comments: [...prevStep.comments.filter((c) => c.id !== comment.id)],
          },
        });
      }
    }
  };

  const [deleteCommentMutation, { loading }] = useMutation<
    deleteCommentMutation,
    deleteCommentMutationVariables
  >(DELETE_COMMENT_MUTATION, { onCompleted });

  const onDeleteCommentIconClick = (commentId: number) => {
    if (!loading) {
      deleteCommentMutation({ variables: { input: { id: commentId } } });
    }
  };

  return (
    <li className="flex items-center">
      <Avatar avatarUrl={comment.creator.avatarUrl} size={8} />
      <div className="w-full ml-3 text-sm">
        <Link to="#" className="mr-1 text-myGreen-darkest font-semibold">
          {comment.creator.username}
        </Link>
        <p className="inline text-myGray-darkest">{comment.text}</p>
        <span className="block text-xs text-myGray-dark">
          {moment(comment.createdAt).format('D MMMM YYYY') === 'Invalid date'
            ? comment.createdAt
            : moment(comment.createdAt).format('D MMMM YYYY')}
        </span>
      </div>
      {userData?.whoAmI.id === comment.creator.id && (
        <FontAwesomeIcon
          icon={faTrashAlt}
          className="text-myRed cursor-pointer opacity-60 hover:opacity-100"
          onClick={() => onDeleteCommentIconClick(comment.id)}
        />
      )}
    </li>
  );
};
