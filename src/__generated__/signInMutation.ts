/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: signInMutation
// ====================================================

export interface signInMutation_login {
  __typename: "LoginOutput";
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface signInMutation {
  login: signInMutation_login;
}

export interface signInMutationVariables {
  input: LoginInput;
}
