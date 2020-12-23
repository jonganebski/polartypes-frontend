/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateAccountInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateAccountMutation
// ====================================================

export interface updateAccountMutation_updateAccount {
  __typename: "UpdateAccountOutput";
  ok: boolean;
  error: string | null;
}

export interface updateAccountMutation {
  updateAccount: updateAccountMutation_updateAccount;
}

export interface updateAccountMutationVariables {
  input: UpdateAccountInput;
}
