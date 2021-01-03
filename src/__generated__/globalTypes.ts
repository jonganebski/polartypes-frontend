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

export interface CommentInputType {
  text: string;
  creator: UserInputType;
  step: StepInputType;
}

export interface CreateAccountInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface CreateCommentInput {
  text: string;
  stepId: number;
}

export interface CreateStepInput {
  location: string;
  country: string;
  lat: number;
  lon: number;
  name: string;
  arrivedAt: string;
  timeZone: string;
  imgUrls?: string[] | null;
  tripId: number;
  story?: string | null;
}

export interface CreateTripInput {
  startDate: string;
  name: string;
  availability: Availability;
  summary?: string | null;
  endDate?: string | null;
}

export interface DeleteAccountInput {
  password?: string | null;
}

export interface DeleteCommentInput {
  id: number;
}

export interface DeleteStepInput {
  stepId: number;
}

export interface DeleteTripInput {
  tripId: number;
}

export interface FollowInput {
  id: number;
}

export interface LikeInputType {
  userId: number;
  stepId: number;
  user: UserInputType;
  step: StepInputType;
}

export interface LoginInput {
  password: string;
  usernameOrEmail: string;
  rememberMe: boolean;
}

export interface ReadTripInput {
  tripId: number;
}

export interface ReadTripsInput {
  targetUsername: string;
}

export interface StepInputType {
  location: string;
  country: string;
  lat: number;
  lon: number;
  name: string;
  arrivedAt: string;
  timeZone: string;
  story?: string | null;
  imgUrls?: string[] | null;
  likes: LikeInputType[];
  comments: CommentInputType[];
  traveler: UserInputType;
  trip: TripInputType;
}

export interface ToggleLikeInput {
  id: number;
}

export interface TripInputType {
  startDate: string;
  endDate?: string | null;
  name: string;
  summary?: string | null;
  coverUrl?: string | null;
  availability: Availability;
  viewCount?: number | null;
  traveler: UserInputType;
  steps: StepInputType[];
}

export interface UnfollowInput {
  id: number;
}

export interface UpdateAccountInput {
  username?: string | null;
  slug?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  about?: string | null;
  avatarUrl?: string | null;
  city?: string | null;
  timeZone?: string | null;
  newPassword?: string | null;
}

export interface UpdateStepInput {
  id?: number | null;
  createdAt?: any | null;
  updatedAt?: any | null;
  location?: string | null;
  country?: string | null;
  lat?: number | null;
  lon?: number | null;
  name?: string | null;
  arrivedAt?: string | null;
  timeZone?: string | null;
  story?: string | null;
  imgUrls?: string[] | null;
  likes?: LikeInputType[] | null;
  comments?: CommentInputType[] | null;
  traveler?: UserInputType | null;
  trip?: TripInputType | null;
  stepId: number;
}

export interface UpdateTripInput {
  id?: number | null;
  createdAt?: any | null;
  updatedAt?: any | null;
  startDate?: string | null;
  endDate?: string | null;
  name?: string | null;
  summary?: string | null;
  coverUrl?: string | null;
  availability?: Availability | null;
  viewCount?: number | null;
  traveler?: UserInputType | null;
  steps?: StepInputType[] | null;
  tripId: number;
}

export interface UserInputType {
  email: string;
  username: string;
  slug: string;
  password: string;
  firstName: string;
  lastName: string;
  about?: string | null;
  avatarUrl?: string | null;
  city?: string | null;
  timeZone?: string | null;
  trips: TripInputType[];
  steps: StepInputType[];
  followers: UserInputType[];
  followings: UserInputType[];
  comments: CommentInputType[];
  likes: LikeInputType[];
}

//==============================================================
// END Enums and Input Objects
//==============================================================
