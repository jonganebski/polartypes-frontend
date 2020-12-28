/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: step
// ====================================================

export interface step_likes_user {
  __typename: "Users";
  username: string;
}

export interface step_likes {
  __typename: "Like";
  user: step_likes_user;
}

export interface step {
  __typename: "Step";
  likes: step_likes[];
}
