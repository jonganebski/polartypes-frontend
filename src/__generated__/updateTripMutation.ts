/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTripInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateTripMutation
// ====================================================

export interface updateTripMutation_updateTrip {
  __typename: "UpdateTripOutput";
  ok: boolean;
  error: string | null;
}

export interface updateTripMutation {
  updateTrip: updateTripMutation_updateTrip;
}

export interface updateTripMutationVariables {
  input: UpdateTripInput;
}
