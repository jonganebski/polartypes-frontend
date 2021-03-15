/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: searchQuery
// ====================================================

export interface searchQuery_search_users {
  __typename: "Users";
  id: number;
  slug: string;
  username: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  city: string | null;
  timeZone: string | null;
  isFollowing: boolean;
  isMe: boolean;
}

export interface searchQuery_search_trips_traveler {
  __typename: "Users";
  firstName: string;
  lastName: string | null;
  username: string;
}

export interface searchQuery_search_trips {
  __typename: "Trip";
  id: number;
  name: string;
  coverUrl: string | null;
  traveler: searchQuery_search_trips_traveler;
}

export interface searchQuery_search {
  __typename: "SearchOutput";
  ok: boolean;
  error: string | null;
  usersCount: number | null;
  users: searchQuery_search_users[] | null;
  tripsCount: number | null;
  trips: searchQuery_search_trips[] | null;
}

export interface searchQuery {
  search: searchQuery_search;
}

export interface searchQueryVariables {
  input: SearchInput;
}
