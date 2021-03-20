import { gql, useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { COMMENT_FRAGMENT } from '../../fragments';
import {
  listCommentsQuery,
  listCommentsQueryVariables,
} from '../../__generated__/listCommentsQuery';

const LIST_COMMENTS_QUERY = gql`
  query listCommentsQuery($input: ListCommentsInput!) {
    listComments(input: $input) {
      hasNextPage
      endCursorDate
      error
      ok
      step {
        id
        comments {
          ...CommentParts
        }
      }
    }
  }
  ${COMMENT_FRAGMENT}
`;

export const useListComments = (stepId: number) => {
  const [listCommentsQuery, listCommentsQueryResult] = useLazyQuery<
    listCommentsQuery,
    listCommentsQueryVariables
  >(LIST_COMMENTS_QUERY);

  useEffect(() => {
    listCommentsQuery({ variables: { input: { stepId } } });
    // eslint-disable-next-line
  }, [stepId]);

  return listCommentsQueryResult;
};
