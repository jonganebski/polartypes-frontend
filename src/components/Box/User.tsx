import React from 'react';
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
  const { me } = useWhoAmI();
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
      <div className="w-32 flex justify-center">
        {!(me?.slug === user.slug) ? (
          user.isFollowing ? (
            <Button
              text="following"
              size="sm"
              type="blue-solid"
              isSubmitBtn={false}
              onClick={() => {
                if (me?.slug) {
                  unfollowMutation({
                    variables: { input: { slug: user.slug } },
                  });
                }
              }}
            />
          ) : (
            <Button
              text="follow"
              size="sm"
              type="blue-regular"
              onClick={() => {
                if (me?.slug) {
                  followMutation({ variables: { input: { slug: user.slug } } });
                }
              }}
            />
          )
        ) : null}
      </div>
    </li>
  );
};
