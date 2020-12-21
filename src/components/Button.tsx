import React from 'react';

interface IButtonProps {
  text: string;
  type: 'red-solid';
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<IButtonProps> = ({
  text,
  type,
  disabled = false,
  loading = false,
}) => {
  return (
    <button
      className={`focus:outline-none font-semibold px-5 py-3 rounded-full mr-1 ${
        disabled
          ? 'pointer-events-none bg-myGray text-myGray-light'
          : type === 'red-solid'
          ? 'bg-myRed text-white'
          : ''
      }`}
    >
      {text}
    </button>
  );
};
