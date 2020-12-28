/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateCommentInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createCommentMutation
// ====================================================

export interface createCommentMutation_createComment {
  __typename: "CreateCommentOutput";
  ok: boolean;
  error: string | null;
  commentId: number | null;
}

export interface createCommentMutation {
  createComment: createCommentMutation_createComment;
}

export interface createCommentMutationVariables {
  input: CreateCommentInput;
}
