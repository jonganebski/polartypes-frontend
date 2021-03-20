/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateStepInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateStepMutation
// ====================================================

export interface updateStepMutation_updateStep {
  __typename: "UpdateStepOutput";
  ok: boolean;
  error: string | null;
  imgUrls: string[] | null;
}

export interface updateStepMutation {
  updateStep: updateStepMutation_updateStep;
}

export interface updateStepMutationVariables {
  input: UpdateStepInput;
}
