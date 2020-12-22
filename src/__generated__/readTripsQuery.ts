/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReadTripsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: readTripsQuery
// ====================================================

export interface readTripsQuery_readTrips_targetUser_followers {
  __typename: "Users";
  id: number;
}

export interface readTripsQuery_readTrips_targetUser_followings {
  __typename: "Users";
  id: number;
}

export interface readTripsQuery_readTrips_targetUser_trips {
  __typename: "Trip";
  name: string;
  startDate: any;
}

export interface readTripsQuery_readTrips_targetUser {
  __typename: "Users";
  firstName: string;
  lastName: string;
  about: string | null;
  city: string | null;
  avatarUrl: string | null;
  followers: readTripsQuery_readTrips_targetUser_followers[];
  followings: readTripsQuery_readTrips_targetUser_followings[];
  trips: readTripsQuery_readTrips_targetUser_trips[];
}

export interface readTripsQuery_readTrips {
  __typename: "ReadTripsOutput";
  ok: boolean;
  error: string | null;
  targetUser: readTripsQuery_readTrips_targetUser | null;
}

export interface readTripsQuery {
  readTrips: readTripsQuery_readTrips;
}

export interface readTripsQueryVariables {
  input: ReadTripsInput;
}
