import React from 'react';

interface IAvatarProps {
  size: number;
}

export const Avatar: React.FC<IAvatarProps> = ({ size }) => {
  return (
    <div
      style={{ backgroundImage: 'url("blank-profile.webp")' }}
      className={`w-${size} h-${size} rounded-full bg-cover bg-center`}
    />
  );
};
