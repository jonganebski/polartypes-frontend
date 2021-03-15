/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ToggleLike
// ====================================================

export interface ToggleLike_user {
  __typename: "Users";
  slug: string;
  username: string;
  avatarUrl: string | null;
}

export interface ToggleLike {
  __typename: "Like";
  userId: number;
  stepId: number;
  user: ToggleLike_user;
}
