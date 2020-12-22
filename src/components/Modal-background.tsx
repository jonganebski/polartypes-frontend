import React from 'react';

interface IModalBackgroundProps {
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const ModalBackground: React.FC<IModalBackgroundProps> = ({
  onClick,
}) => (
  <div
    className="fixed z-50 top-0 w-screen h-screen bg-myGreen-darkest opacity-80"
    onClick={onClick}
  ></div>
);
