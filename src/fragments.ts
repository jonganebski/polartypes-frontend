import { gql } from '@apollo/client';

export const LIKE_FRAGMENT = gql`
  fragment LikeParts on Like {
    userId
    stepId
    user {
      slug
      username
      avatarUrl
    }
  }
`;

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
    countComments
    traveler {
      slug
      isMe
    }
    likes {
      ...LikeParts
    }
  }
  ${LIKE_FRAGMENT}
`;

export const COMMENT_FRAGMENT = gql`
  fragment CommentParts on Comment {
    id
    createdAt
    text
    creator {
      slug
      username
      avatarUrl
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

export const USER_CORE_FRAGMENT = gql`
  fragment UserCoreParts on Users {
    id
    slug
    username
    firstName
    lastName
    avatarUrl
    city
    timeZone
    isFollowing
    isMe
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserParts on Users {
    ...UserCoreParts
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
    countFollowings
    countFollowers
    isFollowing
    isFollower
    isMe
    trips {
      id
      name
      startDate
      endDate
      coverUrl
      steps {
        id
        lat
        lon
        arrivedAt
        imgUrls
        country
        likes {
          ...LikeParts
        }
      }
    }
  }
  ${USER_CORE_FRAGMENT}
  ${LIKE_FRAGMENT}
`;
