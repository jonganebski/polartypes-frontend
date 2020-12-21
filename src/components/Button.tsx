import React from 'react';
import { Spinner } from './Loading-spinner';

interface IButtonProps {
  text: string;
  type: 'red-solid' | 'blue-regular' | 'void';
  fontColorClass?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const Button: React.FC<IButtonProps> = ({
  text,
  type,
  fontColorClass,
  disabled = false,
  loading = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative focus:outline-none font-semibold px-5 py-3 rounded-full ${
        disabled
          ? 'pointer-events-none bg-myGray text-myGray-light'
          : type === 'red-solid'
          ? 'bg-myRed text-white'
          : type === 'blue-regular'
          ? 'border border-myBlue text-myBlue'
          : type === 'void'
          ? `bg-transparent ${fontColorClass}`
          : ''
      }`}
    >
      {loading && <Spinner />}
      <span className={`${loading && 'opacity-0'}`}>{text}</span>
    </button>
  );
};
