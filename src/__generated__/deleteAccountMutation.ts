/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteAccountInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteAccountMutation
// ====================================================

export interface deleteAccountMutation_deleteAccount {
  __typename: "DeleteAccountoutput";
  ok: boolean;
  error: string | null;
}

export interface deleteAccountMutation {
  deleteAccount: deleteAccountMutation_deleteAccount;
}

export interface deleteAccountMutationVariables {
  input: DeleteAccountInput;
}
