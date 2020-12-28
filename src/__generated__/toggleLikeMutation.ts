/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ToggleLikeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: toggleLikeMutation
// ====================================================

export interface toggleLikeMutation_toggleLike {
  __typename: "ToggleLikeOutput";
  ok: boolean;
  error: string | null;
  toggle: number | null;
}

export interface toggleLikeMutation {
  toggleLike: toggleLikeMutation_toggleLike;
}

export interface toggleLikeMutationVariables {
  input: ToggleLikeInput;
}
