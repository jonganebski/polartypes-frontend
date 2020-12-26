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
  username: string;
  timeZone: string | null;
}

export interface readTripQuery_readTrip_trip_steps_likes_user {
  __typename: "Users";
  username: string;
}

export interface readTripQuery_readTrip_trip_steps_likes {
  __typename: "Like";
  user: readTripQuery_readTrip_trip_steps_likes_user;
}

export interface readTripQuery_readTrip_trip_steps_images {
  __typename: "Image";
  url: string;
}

export interface readTripQuery_readTrip_trip_steps_comments {
  __typename: "Comment";
  id: number;
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
  likes: readTripQuery_readTrip_trip_steps_likes[];
  images: readTripQuery_readTrip_trip_steps_images[];
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
