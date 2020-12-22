/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTripInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createTripMutation
// ====================================================

export interface createTripMutation_createTrip {
  __typename: "CreateTripOutput";
  ok: boolean;
  error: string | null;
}

export interface createTripMutation {
  createTrip: createTripMutation_createTrip;
}

export interface createTripMutationVariables {
  input: CreateTripInput;
}
