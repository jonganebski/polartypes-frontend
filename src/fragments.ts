import { gql } from '@apollo/client';

export const STEPS_FRAGMENTS = gql`
  fragment StepParts on Step {
    id
    name
    location
    country
    arrivedAt
    timeZone
    lat
    lon
    story
    imgUrls
    traveler {
      id
    }
    likes {
      user {
        username
        avatarUrl
      }
    }
    comments {
      id
      createdAt
      text
      creator {
        id
        username
        avatarUrl
      }
    }
  }
`;

export const UPDATED_STEP_FRAGMENT = gql`
  fragment UpdatedStep on Step {
    location
    lat
    lon
    name
    country
    arrivedAt
    timeZone
    story
    imgUrls
  }
`;

const USER_CORE_FRAGMENT = gql`
  fragment UserCoreParts on Users {
    id
    username
    firstName
    lastName
    avatarUrl
    timeZone
  }
`;

export const TRAVELER_FRAGMENT = gql`
  fragment TravelerParts on Users {
    ...UserCoreParts
    followers {
      id
    }
  }
  ${USER_CORE_FRAGMENT}
`;

export const USER_FRAGMENT = gql`
  fragment UserParts on Users {
    ...UserCoreParts
    slug
    city
    about
  }
  ${USER_CORE_FRAGMENT}
`;

export const TARGET_USER_FRAGMENT = gql`
  fragment TargetUserParts on Users {
    ...UserCoreParts
    about
    city
    followers {
      id
    }
    followings {
      id
    }
    trips {
      id
      name
      startDate
      endDate
      steps {
        id
        lat
        lon
        arrivedAt
      }
    }
  }
  ${USER_CORE_FRAGMENT}
`;
