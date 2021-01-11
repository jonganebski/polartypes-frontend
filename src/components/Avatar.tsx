import React from 'react';

interface IAvatarProps {
  avatarUrl: string | null;
  size: 8 | 10 | 14 | 16;
}

export const Avatar: React.FC<IAvatarProps> = ({ avatarUrl, size }) => {
  return (
    <div
      style={{ backgroundImage: `url(${avatarUrl ?? '/blank-profile.webp'})` }}
      className={`${size === 8 && 'w-8 h-8'} ${size === 10 && 'w-10 h-10'} ${
        size === 14 && 'w-14 h-14'
      } ${size === 16 && 'w-16 h-16'} rounded-full bg-cover bg-center`}
    />
  );
};
