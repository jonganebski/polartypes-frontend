/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListCommentsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: listCommentsQuery
// ====================================================

export interface listCommentsQuery_listComments_step_comments_creator {
  __typename: "Users";
  slug: string;
  username: string;
  avatarUrl: string | null;
}

export interface listCommentsQuery_listComments_step_comments {
  __typename: "Comment";
  id: number;
  createdAt: any;
  text: string;
  creator: listCommentsQuery_listComments_step_comments_creator;
}

export interface listCommentsQuery_listComments_step {
  __typename: "Step";
  id: number;
  comments: listCommentsQuery_listComments_step_comments[];
}

export interface listCommentsQuery_listComments {
  __typename: "ListCommentsOutput";
  hasMorePages: boolean | null;
  endCursorId: number | null;
  error: string | null;
  ok: boolean;
  step: listCommentsQuery_listComments_step | null;
}

export interface listCommentsQuery {
  listComments: listCommentsQuery_listComments;
}

export interface listCommentsQueryVariables {
  input: ListCommentsInput;
}
