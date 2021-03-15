/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: LikeParts
// ====================================================

export interface LikeParts_user {
  __typename: "Users";
  slug: string;
  username: string;
  avatarUrl: string | null;
}

export interface LikeParts {
  __typename: "Like";
  userId: number;
  stepId: number;
  user: LikeParts_user;
}
