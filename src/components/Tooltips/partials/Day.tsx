import React from 'react';

interface IDayProps {
  isValid: boolean;
  isSelectedDate: boolean;
  date: number;
  isThisMonth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

export const Day: React.FC<IDayProps> = ({
  isValid,
  isSelectedDate,
  isThisMonth = false,
  date,
  onClick,
}) => {
  return (
    <span
      className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isThisMonth && 'text-white'
      } ${!isValid && 'opacity-5'} ${isSelectedDate && 'bg-myBlue'}`}
      onClick={isValid ? onClick : undefined}
    >
      {date}
    </span>
  );
};
