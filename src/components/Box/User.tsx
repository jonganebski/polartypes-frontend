import React from 'react';
import { Link } from 'react-router-dom';
import { useFollow } from '../../hooks/useMutation/useFollow';
import { useUnfollow } from '../../hooks/useMutation/useUnfollow';
import { searchQuery_search_users } from '../../__generated__/searchQuery';
import { Avatar } from '../Avatar';
import { Button } from '../Button';

interface IUserBoxProps {
  user: searchQuery_search_users;
  isFollowing: boolean;
  currentUserId?: number;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const UserBox: React.FC<IUserBoxProps> = ({
  user,
  currentUserId,
  isFollowing,
  onClick,
}) => {
  const [followMutation] = useFollow();
  const [unfollowMutation] = useUnfollow();
  return (
    <li className="p-5 flex items-center bg-white cursor-pointer hover:bg-myGray-lightest">
      <Link
        to={`/${user.username}`}
        className="w-full flex items-center"
        onClick={onClick && onClick}
      >
        <Avatar avatarUrl={user.avatarUrl} size={10} />
        <div className="ml-3">
          <span className="block text-myGreen-dark font-semibold">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-xs text-myGray-dark">{user.city}</span>
        </div>
      </Link>
      {!(currentUserId === user.id) ? (
        isFollowing ? (
          <Button
            text="following"
            size="sm"
            type="blue-solid"
            isSubmitBtn={false}
            onClick={() => {
              if (currentUserId) {
                unfollowMutation({ variables: { input: { id: user.id } } });
              }
            }}
          />
        ) : (
          <Button
            text="follow"
            size="sm"
            type="blue-regular"
            onClick={() => {
              if (currentUserId) {
                followMutation({ variables: { input: { id: user.id } } });
              }
            }}
          />
        )
      ) : null}
    </li>
  );
};
