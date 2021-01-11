import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass } from '@fortawesome/free-regular-svg-icons';
import React from 'react';

interface ISpinnerProps {
  color?: string;
  size?: string;
}

export const Spinner: React.FC<ISpinnerProps> = ({
  color = 'white',
  size = 'xl',
}) => (
  <div
    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-${color} text-${size}`}
  >
    <FontAwesomeIcon icon={faCompass} className="animate-spin" />
  </div>
);
