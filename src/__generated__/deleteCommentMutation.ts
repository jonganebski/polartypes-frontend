/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteCommentInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteCommentMutation
// ====================================================

export interface deleteCommentMutation_deleteComment {
  __typename: "DeleteCommentOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteCommentMutation {
  deleteComment: deleteCommentMutation_deleteComment;
}

export interface deleteCommentMutationVariables {
  input: DeleteCommentInput;
}
