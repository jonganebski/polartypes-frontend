/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: toggledLikeStep
// ====================================================

export interface toggledLikeStep_likes_user {
  __typename: "Users";
  username: string;
}

export interface toggledLikeStep_likes {
  __typename: "Like";
  user: toggledLikeStep_likes_user;
}

export interface toggledLikeStep {
  __typename: "Step";
  likes: toggledLikeStep_likes[];
}
