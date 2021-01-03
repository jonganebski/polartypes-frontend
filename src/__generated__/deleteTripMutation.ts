/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteTripInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteTripMutation
// ====================================================

export interface deleteTripMutation_deleteTrip {
  __typename: "DeleteTripOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteTripMutation {
  deleteTrip: deleteTripMutation_deleteTrip;
}

export interface deleteTripMutationVariables {
  input: DeleteTripInput;
}
