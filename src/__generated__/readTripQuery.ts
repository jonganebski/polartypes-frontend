/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReadTripInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: readTripQuery
// ====================================================

export interface readTripQuery_readTrip_trip_traveler {
  __typename: "Users";
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  timeZone: string | null;
}

export interface readTripQuery_readTrip_trip_steps_traveler {
  __typename: "Users";
  id: number;
}

export interface readTripQuery_readTrip_trip_steps_likes_user {
  __typename: "Users";
  username: string;
  avatarUrl: string | null;
}

export interface readTripQuery_readTrip_trip_steps_likes {
  __typename: "Like";
  user: readTripQuery_readTrip_trip_steps_likes_user;
}

export interface readTripQuery_readTrip_trip_steps_comments_creator {
  __typename: "Users";
  id: number;
  username: string;
  avatarUrl: string | null;
}

export interface readTripQuery_readTrip_trip_steps_comments {
  __typename: "Comment";
  id: number;
  createdAt: any;
  text: string;
  creator: readTripQuery_readTrip_trip_steps_comments_creator;
}

export interface readTripQuery_readTrip_trip_steps {
  __typename: "Step";
  id: number;
  name: string;
  location: string;
  country: string;
  arrivedAt: string;
  timeZone: string;
  lat: number;
  lon: number;
  story: string | null;
  imgUrls: string[] | null;
  traveler: readTripQuery_readTrip_trip_steps_traveler;
  likes: readTripQuery_readTrip_trip_steps_likes[];
  comments: readTripQuery_readTrip_trip_steps_comments[];
}

export interface readTripQuery_readTrip_trip {
  __typename: "Trip";
  startDate: string;
  endDate: string | null;
  traveler: readTripQuery_readTrip_trip_traveler;
  steps: readTripQuery_readTrip_trip_steps[];
}

export interface readTripQuery_readTrip {
  __typename: "ReadTripOutput";
  ok: boolean;
  error: string | null;
  trip: readTripQuery_readTrip_trip | null;
}

export interface readTripQuery {
  readTrip: readTripQuery_readTrip;
}

export interface readTripQueryVariables {
  input: ReadTripInput;
}
