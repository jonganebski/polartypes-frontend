import React from 'react';

interface IAvatarProps {
  avatarUrl: string | null;
  size: number;
}

export const Avatar: React.FC<IAvatarProps> = ({ avatarUrl, size }) => {
  return (
    <div
      style={{ backgroundImage: `url(${avatarUrl ?? '/blank-profile.webp'})` }}
      className={`w-${size} h-${size} rounded-full bg-cover bg-center`}
    />
  );
};
