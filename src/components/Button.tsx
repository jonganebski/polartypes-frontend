import React from 'react';
import { Spinner } from './Loading-spinner';

interface IButtonProps {
  text: string;
  type:
    | 'red-solid'
    | 'white-solid'
    | 'blue-solid'
    | 'blue-regular'
    | 'white-regular'
    | 'void';
  isSubmitBtn?: boolean;
  className?: string;
  size?: 'sm' | 'md';
  fontColorClass?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  icon?: JSX.Element;
}

export const Button: React.FC<IButtonProps> = ({
  text,
  type,
  isSubmitBtn = true,
  className,
  size = 'md',
  fontColorClass,
  disabled = false,
  loading = false,
  onClick,
  icon,
}) => {
  return (
    <button
      type={isSubmitBtn ? 'submit' : 'button'}
      onClick={onClick}
      className={`relative focus:outline-none font-semibold rounded-full ${className} ${
        size === 'sm' ? 'px-3.5 py-1.5 text-xs' : 'px-5 py-3'
      } ${
        disabled
          ? 'pointer-events-none bg-myGray text-myGray-light'
          : type === 'red-solid'
          ? 'bg-myRed text-white border border-myRed'
          : type === 'white-solid'
          ? `bg-white ${
              fontColorClass ?? 'text-myGray-darkest'
            } border border-myGray-light hover:bg-myGray-light active:bg-myGray`
          : type === 'blue-solid'
          ? 'bg-myBlue text-white border border-myBlue bg-opacity-90 hover:bg-opacity-100 active:bg-opacity-50'
          : type === 'blue-regular'
          ? 'border border-myBlue text-myBlue hover:bg-myBlue hover:text-white active:bg-myBlue-dark active:text-white'
          : type === 'white-regular'
          ? 'border border-myGray-dark text-white hover:bg-myGray-dark active:bg-myGray-darkest'
          : type === 'void'
          ? `bg-transparent ${fontColorClass}`
          : ''
      }`}
    >
      {loading && <Spinner />}
      {icon}
      <span className={`${loading && 'opacity-0'}`}>{text}</span>
    </button>
  );
};
