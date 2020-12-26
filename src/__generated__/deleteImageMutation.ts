/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteImagesInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteImageMutation
// ====================================================

export interface deleteImageMutation_deleteImage {
  __typename: "DeleteImagesOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteImageMutation {
  deleteImage: deleteImageMutation_deleteImage;
}

export interface deleteImageMutationVariables {
  input: DeleteImagesInput;
}
