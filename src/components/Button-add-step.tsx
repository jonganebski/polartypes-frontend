import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface IAddStepButton {
  isSelf: boolean;
  onClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}

export const AddStepButton: React.FC<IAddStepButton> = ({
  isSelf,
  onClick,
}) => (
  <li role="button" onClick={onClick} className="relative group">
    <div className="w-8 h-16 border-r border-myGray"></div>
    {isSelf && (
      <div className="absolute top-1/2 left-6 transform -translate-y-1/2 w-full flex items-center">
        <FontAwesomeIcon
          icon={faPlusCircle}
          className="rounded-full text-myBlue bg-white"
        />
        <div className="absolute top-0 transform translate-y-3 left-6 text-xs text-myGreen-darkest opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          Add step
        </div>
      </div>
    )}
  </li>
);
