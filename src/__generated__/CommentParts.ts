/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CommentParts
// ====================================================

export interface CommentParts_creator {
  __typename: "Users";
  slug: string;
  username: string;
  avatarUrl: string | null;
}

export interface CommentParts {
  __typename: "Comment";
  id: number;
  createdAt: any;
  text: string;
  creator: CommentParts_creator;
}
