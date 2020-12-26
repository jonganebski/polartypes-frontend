/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateImageInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createImageMutation
// ====================================================

export interface createImageMutation_createImage {
  __typename: "CreateImageOutput";
  ok: boolean;
  error: string | null;
  stepId: number | null;
}

export interface createImageMutation {
  createImage: createImageMutation_createImage;
}

export interface createImageMutationVariables {
  input: CreateImageInput;
}
