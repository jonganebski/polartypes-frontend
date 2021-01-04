import { gql, useMutation } from '@apollo/client';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { client } from '../../../apollo';
import {
  deleteCommentMutation,
  deleteCommentMutationVariables,
} from '../../../__generated__/deleteCommentMutation';
import { readTripQuery_readTrip_trip_steps_comments } from '../../../__generated__/readTripQuery';
import { whoAmIQuery } from '../../../__generated__/whoAmIQuery';
import { Avatar } from '../../Avatar';

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteCommentMutation($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      ok
      error
    }
  }
`;

interface ICommentProps {
  userData: whoAmIQuery | undefined;
  comment: readTripQuery_readTrip_trip_steps_comments;
}

export const Comment: React.FC<ICommentProps> = ({ userData, comment }) => {
  const onCompleted = (data: deleteCommentMutation) => {
    const {
      deleteComment: { ok, error },
    } = data;
    if (ok && !error) {
      client.cache.evict({ id: `Comment:${comment.id}` });
    }
  };

  const [deleteCommentMutation, { loading }] = useMutation<
    deleteCommentMutation,
    deleteCommentMutationVariables
  >(DELETE_COMMENT_MUTATION, {
    onCompleted,
  });

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
          {isNaN(new Date(comment.createdAt).getTime())
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
