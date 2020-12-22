import { faCompass } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';

interface ILogoProps {
  isAlterHeader?: boolean;
  usage: 'home' | 'common';
}

export const Logo: React.FC<ILogoProps> = ({
  isAlterHeader = false,
  usage,
}) => (
  <Link
    to="/"
    className={`flex items-center font-headFont ${
      isAlterHeader ? 'text-myGreen-darkest' : 'text-white'
    }`}
  >
    <FontAwesomeIcon
      icon={faCompass}
      className={`${
        usage === 'home' ? 'text-4xl' : usage === 'common' ? 'text-2xl' : ''
      } mr-1`}
    />
    <span
      className={`${
        usage === 'home'
          ? 'text-3xl font-bold'
          : usage === 'common'
          ? 'text-2xl font-semibold'
          : ''
      }`}
    >
      polartypes
    </span>
  </Link>
);
