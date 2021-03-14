import { useReactiveVar } from '@apollo/client';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { isLoggedInVar } from '../apollo';
import { useFollow } from '../hooks/useMutation/useFollow';
import { useUnfollow } from '../hooks/useMutation/useUnfollow';
import { readTripsQuery_readTrips_targetUser } from '../__generated__/readTripsQuery';
import { Avatar } from './Avatar';
import { Button } from './Button';

interface IUserItroProps {
  targetUser: readTripsQuery_readTrips_targetUser;
  isSelf: boolean;
  setIsFollowersModal: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const UserIntro: React.FC<IUserItroProps> = ({
  targetUser,
  isSelf,
  setIsFollowersModal,
}) => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const [followMutation] = useFollow();
  const [unfollowMutation] = useUnfollow();
  return (
    <div className="relative p-5 flex flex-col items-center">
      <div
        style={{
          backgroundImage: 'url("andreas-gucklhorn-mawU2PoJWfU-unsplash.jpg")',
          filter: 'blur(2px)',
          zIndex: -2,
        }}
        className="absolute top-0 w-full h-full bg-cover bg-center"
      ></div>
      <div
        style={{ zIndex: -1 }}
        className="absolute top-0 w-full h-full bg-myGreen-darkest opacity-80"
      ></div>
      <Avatar avatarUrl={targetUser?.avatarUrl ?? null} size={16} />
      <h2 className="mt-2 mb-1 text-white text-xl font-semibold">
        {targetUser?.firstName} {targetUser?.lastName}
      </h2>
      <h6 className="mb-3 text-myGray-dark text-xs">
        {targetUser?.city ?? 'Somewhere in the world'}
      </h6>
      {targetUser?.about && (
        <p className="mb-3 text-white text-sm text-center">
          {targetUser.about}
        </p>
      )}
      <div className="mt-4">
        <Button
          text={
            targetUser.countFollowers === 1
              ? '1 Follower'
              : `${targetUser.countFollowers} Followers`
          }
          type="white-regular"
          size="sm"
          className="mr-2"
          onClick={() => isLoggedIn && setIsFollowersModal(true)}
        />
        <Button
          text={`${targetUser?.countFollowings} following`}
          type="white-regular"
          size="sm"
          onClick={() => isLoggedIn && setIsFollowersModal(false)}
        />
        {isLoggedInVar() && !isSelf && !targetUser.isFollowing && (
          <Button
            text="Follow"
            type="void"
            className="text-white border border-myBlue ml-2 hover:bg-myBlue active:bg-myBlue-dark"
            size="sm"
            onClick={() => {
              targetUser &&
                followMutation({
                  variables: {
                    input: { slug: targetUser.slug },
                  },
                });
            }}
          />
        )}
        {!isSelf && targetUser.isFollowing && (
          <Button
            text=""
            type="blue-solid"
            size="sm"
            className="ml-2"
            icon={<FontAwesomeIcon icon={faUserCheck} />}
            onClick={() => {
              targetUser &&
                unfollowMutation({
                  variables: {
                    input: { slug: targetUser.slug },
                  },
                });
            }}
          />
        )}
      </div>
    </div>
  );
};
