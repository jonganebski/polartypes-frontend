import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface IModalCloseIconProps {
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const ModalCloseIcon: React.FC<IModalCloseIconProps> = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute top-1 right-1 p-2 group cursor-pointer"
  >
    <FontAwesomeIcon
      icon={faTimesCircle}
      className="text-xl text-myGreen-darkest group-hover:text-opacity-80"
    />
  </div>
);
