/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteStepInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteStepMutation
// ====================================================

export interface deleteStepMutation_deleteStep {
  __typename: "DeleteStepOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteStepMutation {
  deleteStep: deleteStepMutation_deleteStep;
}

export interface deleteStepMutationVariables {
  input: DeleteStepInput;
}
