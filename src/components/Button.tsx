import React from 'react';
import { Spinner } from './Loading-spinner';

interface IButtonProps {
  text: string;
  type: 'red-solid' | 'blue-regular' | 'white-regular' | 'void';
  className?: string;
  size?: 'sm' | 'md';
  fontColorClass?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const Button: React.FC<IButtonProps> = ({
  text,
  type,
  className,
  size = 'md',
  fontColorClass,
  disabled = false,
  loading = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative focus:outline-none font-semibold rounded-full ${className} ${
        size === 'sm' ? 'px-3.5 py-1.5 text-xs' : 'px-5 py-3'
      } ${
        disabled
          ? 'pointer-events-none bg-myGray text-myGray-light'
          : type === 'red-solid'
          ? 'bg-myRed text-white'
          : type === 'blue-regular'
          ? 'border border-myBlue text-myBlue'
          : type === 'white-regular'
          ? 'border border-white text-white'
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
