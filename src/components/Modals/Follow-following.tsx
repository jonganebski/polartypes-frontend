import React, { useEffect } from 'react';
import { useFollowings } from '../../hooks/useQuery/useFollowings';
import { UserBox } from '../Box/User';
import { Spinner } from '../Loading-spinner';
import { ModalBackground } from './partials/Background';
import { ModalCloseIcon } from './partials/CloseIcon';

interface IFollowFollowingProps {
  isFollowers: boolean;
  currentUserId: number;
  setIsFollowersModal: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const FollowFollowing: React.FC<IFollowFollowingProps> = ({
  isFollowers,
  currentUserId,
  setIsFollowersModal,
}) => {
  const [readFollowings, { data: myFollowings, loading }] = useFollowings();

  useEffect(() => {
    readFollowings({ variables: { input: { targetUserId: currentUserId } } });
  }, [currentUserId, readFollowings]);

  return (
    <>
      <ModalBackground onClick={() => setIsFollowersModal(null)} />
      <div className="modal overflow-hidden">
        <ModalCloseIcon onClick={() => setIsFollowersModal(null)} />
        <div className="py-6 max-h-screen70 text-center text-2xl text-myGreen-darkest font-semibold border-b">
          {isFollowers ? 'Followers' : 'Following'}
        </div>
        {/* <ul className="overflow-y-scroll">
          {loading || !myFollowings?.readFollowings.followings ? (
            <div className="relative h-20 bg-white">
              <Spinner color="myGreen-dark" />
            </div>
          ) : !loading && users.length === 0 ? (
            <div className="flex items-center justify-center h-20 bg-white">
              <span className="text-lg text-myGray">No one yet</span>
            </div>
          ) : (
            users.map((user, i) => (
              <UserBox
                key={i}
                user={user}
                currentUserId={currentUserId}
                isFollowing={
                  myFollowings.readFollowings.followings?.some(
                    (following) => following.id === user.id,
                  ) ?? false
                }
                onClick={() => setIsFollowersModal(null)}
              />
            ))
          )}
        </ul> */}
      </div>
    </>
  );
};
