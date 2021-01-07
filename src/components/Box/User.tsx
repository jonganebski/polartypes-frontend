import React from 'react';
import { Link } from 'react-router-dom';
import { searchQuery_search_users } from '../../__generated__/searchQuery';
import { Avatar } from '../Avatar';
import { Button } from '../Button';

interface IUserBoxProps {
  user: searchQuery_search_users;
}

export const UserBox: React.FC<IUserBoxProps> = ({ user }) => {
  return (
    <li className="bg-white hover:bg-myGray-lightest">
      <Link to={`/${user.username}`} className="p-5 flex items-center">
        <Avatar avatarUrl={user.avatarUrl} size={10} />
        <div className="ml-3">
          <span className="block text-myGreen-dark font-semibold">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-xs text-myGray-dark">{user.city}</span>
        </div>
        <Button
          text="follow?"
          size="sm"
          type="blue-regular"
          className="ml-auto"
        />
      </Link>
    </li>
  );
};
