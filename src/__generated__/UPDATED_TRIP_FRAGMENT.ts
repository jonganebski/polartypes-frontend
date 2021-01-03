/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Availability } from "./globalTypes";

// ====================================================
// GraphQL fragment: UPDATED_TRIP_FRAGMENT
// ====================================================

export interface UPDATED_TRIP_FRAGMENT {
  __typename: "Trip";
  name: string;
  startDate: string;
  endDate: string | null;
  availability: Availability;
  coverUrl: string | null;
  summary: string | null;
}
