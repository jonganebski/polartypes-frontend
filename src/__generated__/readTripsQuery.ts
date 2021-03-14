/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReadTripsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: readTripsQuery
// ====================================================

export interface readTripsQuery_readTrips_targetUser_trips_steps_likes_user {
  __typename: "Users";
  slug: string;
  username: string;
}

export interface readTripsQuery_readTrips_targetUser_trips_steps_likes {
  __typename: "Like";
  user: readTripsQuery_readTrips_targetUser_trips_steps_likes_user;
}

export interface readTripsQuery_readTrips_targetUser_trips_steps {
  __typename: "Step";
  id: number;
  lat: number;
  lon: number;
  arrivedAt: string;
  imgUrls: string[] | null;
  country: string;
  likes: readTripsQuery_readTrips_targetUser_trips_steps_likes[];
}

export interface readTripsQuery_readTrips_targetUser_trips {
  __typename: "Trip";
  id: number;
  name: string;
  startDate: string;
  endDate: string | null;
  coverUrl: string | null;
  steps: readTripsQuery_readTrips_targetUser_trips_steps[];
}

export interface readTripsQuery_readTrips_targetUser {
  __typename: "Users";
  slug: string;
  username: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  city: string | null;
  timeZone: string | null;
  isFollowing: boolean;
  about: string | null;
  countFollowings: number;
  countFollowers: number;
  isFollower: boolean;
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
