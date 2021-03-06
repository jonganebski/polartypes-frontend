import { gql, useMutation } from '@apollo/client';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { client } from '../../../apollo/apollo';
import {
  deleteCommentMutation,
  deleteCommentMutationVariables,
} from '../../../__generated__/deleteCommentMutation';
import { listCommentsQuery_listComments_step_comments } from '../../../__generated__/listCommentsQuery';
import { whoAmIQuery_whoAmI_user } from '../../../__generated__/whoAmIQuery';
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
  comment: listCommentsQuery_listComments_step_comments;
  me: whoAmIQuery_whoAmI_user | null | undefined;
  stepId: number;
}

export const Comment: React.FC<ICommentProps> = ({ comment, stepId, me }) => {
  const onCompleted = (data: deleteCommentMutation) => {
    const {
      deleteComment: { ok, error },
    } = data;
    if (ok && !error) {
      client.cache.evict({ id: `Comment:${comment.id}` });
      client.cache.modify({
        id: `Step:${stepId}`,
        fields: {
          countComments: (prev) => Math.max(--prev, 0),
        },
      });
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
    <li className="flex items-start">
      <Avatar avatarUrl={comment.creator.avatarUrl} size={8} />
      <div className="w-full ml-3 text-sm">
        <Link
          to={`/${comment.creator.username}`}
          className="mr-1 text-myGreen-darkest font-semibold"
        >
          {comment.creator.username}
        </Link>
        <p className="inline text-myGray-darkest">{comment.text}</p>
        <span className="block text-xs text-myGray-dark">
          {isNaN(new Date(comment.createdAt).getTime())
            ? comment.createdAt
            : moment(comment.createdAt).format('D MMMM YYYY')}
        </span>
      </div>
      {me?.slug === comment.creator.slug && (
        <FontAwesomeIcon
          icon={faTrashAlt}
          className="mt-3 text-myRed cursor-pointer opacity-60 hover:opacity-100"
          onClick={() => onDeleteCommentIconClick(comment.id)}
        />
      )}
    </li>
  );
};
