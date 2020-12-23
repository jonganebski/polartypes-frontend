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

export interface ImageInputType {
  url: string;
  step: StepInputType;
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

export interface ReadTripsInput {
  targetUsername: string;
}

export interface StepInputType {
  country: string;
  coord: number[];
  name: string;
  arrivedAt: any;
  timeZone: string;
  story?: string | null;
  likes: LikeInputType[];
  images: ImageInputType[];
  comments: CommentInputType[];
  traveler: UserInputType;
  trip: TripInputType;
}

export interface TripInputType {
  startDate: any;
  endDate?: any | null;
  name: string;
  summary?: string | null;
  coverUrl?: string | null;
  availability: Availability;
  views?: number | null;
  traveler: UserInputType;
  steps: StepInputType[];
}

export interface UpdateAccountInput {
  id?: number | null;
  createdAt?: any | null;
  updatedAt?: any | null;
  email?: string | null;
  username?: string | null;
  slug?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  about?: string | null;
  avatarUrl?: string | null;
  city?: string | null;
  timeZone?: string | null;
  trips?: TripInputType[] | null;
  steps?: StepInputType[] | null;
  followers?: UserInputType[] | null;
  followings?: UserInputType[] | null;
  comments?: CommentInputType[] | null;
  likes?: LikeInputType[] | null;
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
