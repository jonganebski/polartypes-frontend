import React from 'react';
import { Spinner } from './Loading-spinner';

interface IButtonProps {
  text: string;
  type: 'red-solid' | 'void';
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
      className={`relative focus:outline-none font-semibold px-5 py-3 rounded-full mr-1 ${
        disabled
          ? 'pointer-events-none bg-myGray text-myGray-light'
          : type === 'red-solid'
          ? 'bg-myRed text-white'
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
