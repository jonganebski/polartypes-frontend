import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFollow } from '../../hooks/useMutation/useFollow';
import { useUnfollow } from '../../hooks/useMutation/useUnfollow';
import { useWhoAmI } from '../../hooks/useQuery/useWhoAmI';
import { searchQuery_search_users } from '../../__generated__/searchQuery';
import { Avatar } from '../Avatar';
import { Button } from '../Button';

interface IUserBoxProps {
  user: searchQuery_search_users;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const UserBox: React.FC<IUserBoxProps> = ({ user, onClick }) => {
  const [whoAmIQuery, { data: userData }] = useWhoAmI();
  const [followMutation] = useFollow();
  const [unfollowMutation] = useUnfollow();

  useEffect(() => {
    whoAmIQuery();
    // eslint-disable-next-line
  }, []);

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
      {!(userData?.whoAmI.slug === user.slug) ? (
        user.isFollowing ? (
          <Button
            text="following"
            size="sm"
            type="blue-solid"
            isSubmitBtn={false}
            onClick={() => {
              if (userData?.whoAmI.slug) {
                unfollowMutation({ variables: { input: { slug: user.slug } } });
              }
            }}
          />
        ) : (
          <Button
            text="follow"
            size="sm"
            type="blue-regular"
            onClick={() => {
              if (userData?.whoAmI.slug) {
                followMutation({ variables: { input: { slug: user.slug } } });
              }
            }}
          />
        )
      ) : null}
    </li>
  );
};
