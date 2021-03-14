/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FollowInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: followMutation
// ====================================================

export interface followMutation_follow {
  __typename: "FollowOutput";
  ok: boolean;
  error: string | null;
  slug: string | null;
}

export interface followMutation {
  follow: followMutation_follow;
}

export interface followMutationVariables {
  input: FollowInput;
}
