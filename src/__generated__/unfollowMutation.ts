/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UnfollowInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: unfollowMutation
// ====================================================

export interface unfollowMutation_unfollow {
  __typename: "UnfollowOutput";
  ok: boolean;
  error: string | null;
  targetUserId: number | null;
}

export interface unfollowMutation {
  unfollow: unfollowMutation_unfollow;
}

export interface unfollowMutationVariables {
  input: UnfollowInput;
}
