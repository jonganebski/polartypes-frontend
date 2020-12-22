/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum Availability {
  Followers = "Followers",
  Private = "Private",
  Public = "Public",
}

export interface CreateAccountInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateTripInput {
  startDate: any;
  name: string;
  availability: Availability;
  summary?: string | null;
  endDate?: any | null;
}

export interface LoginInput {
  password: string;
  usernameOrEmail: string;
  rememberMe: boolean;
}

export interface ReadTripsInput {
  targetUsername: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
