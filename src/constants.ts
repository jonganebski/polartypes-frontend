export const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const AZ_NUM_PATTERN = /^[a-zA-Z0-9]*$/;

export const PW_MIN_LENGTH = 6;

export const TOKEN = 'polartypes-jwt';

const dateObj = new Date();
export const INITIAL_DATE_STATE = new Date(
  dateObj.getFullYear(),
  dateObj.getMonth(),
  dateObj.getDate(),
);

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const TOTAL_COUNTRIES_IN_THE_WORLD = 193;
