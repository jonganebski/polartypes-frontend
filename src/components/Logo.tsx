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
}) => {
  const linkAttributes: React.HTMLAttributes<HTMLAnchorElement> = {
    className: (() => {
      const core = 'flex items-center font-headFont';
      if (isAlterHeader) {
        return core + ' text-myGreen-darkest';
      }
      return core + ' text-white';
    })(),
  };

  const iconAttributes: React.HTMLAttributes<HTMLOrSVGElement> = {
    className: (() => {
      const core = 'mr-1';
      if (usage === 'home') {
        return core + ' text-4xl';
      }
      return core + ' text-2xl';
    })(),
  };

  const spanAttributes: React.HTMLAttributes<HTMLSpanElement> = {
    className: (() => {
      if (usage === 'home') {
        return 'text-3xl font-bold';
      }
      return 'text-2xl font-semibold';
    })(),
  };

  return (
    <Link to="/" {...linkAttributes}>
      <FontAwesomeIcon icon={faCompass} {...iconAttributes} />
      <span {...spanAttributes}>polartypes</span>
    </Link>
  );
};
