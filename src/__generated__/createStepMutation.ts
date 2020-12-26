/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateStepInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createStepMutation
// ====================================================

export interface createStepMutation_createStep {
  __typename: "CreateStepOutput";
  ok: boolean;
  error: string | null;
  createdStepId: number | null;
}

export interface createStepMutation {
  createStep: createStepMutation_createStep;
}

export interface createStepMutationVariables {
  input: CreateStepInput;
}
