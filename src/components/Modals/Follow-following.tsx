import React, { useEffect } from 'react';
import { useListFollowers } from '../../hooks/useQuery/useListFollowers';
import { useListFollowings } from '../../hooks/useQuery/useListFollowings';
import { UserBox } from '../Box/User';
import { Spinner } from '../Loading-spinner';
import { ModalBackground } from './partials/Background';
import { ModalCloseIcon } from './partials/CloseIcon';

interface IFollowFollowingProps {
  slug: string;
  isFollowers: boolean;
  setIsFollowersModal: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const FollowFollowing: React.FC<IFollowFollowingProps> = ({
  isFollowers,
  slug,
  setIsFollowersModal,
}) => {
  const [
    listFollowings,
    { data: followings, loading: followingsLoading },
  ] = useListFollowings();
  const [
    listFollowers,
    { data: followers, loading: followersLoading },
  ] = useListFollowers();

  useEffect(() => {
    if (isFollowers) {
      listFollowers({ variables: { input: { slug } } });
    } else {
      listFollowings({ variables: { input: { slug } } });
    }
    // eslint-disable-next-line
  }, [slug]);

  const loading = isFollowers ? followersLoading : followingsLoading;
  const data = isFollowers
    ? followers?.listFollowers.user?.followers
    : followings?.listFollowings.user?.followings;

  return (
    <>
      <ModalBackground onClick={() => setIsFollowersModal(null)} />
      <div className="modal overflow-hidden">
        <ModalCloseIcon onClick={() => setIsFollowersModal(null)} />
        <div className="py-6 max-h-screen70 text-center text-2xl text-myGreen-darkest font-semibold border-b">
          {isFollowers ? 'Followers' : 'Following'}
        </div>
        <ul className="overflow-y-scroll">
          {loading ? (
            <div className="relative h-20 bg-white">
              <Spinner color="myGreen-dark" />
            </div>
          ) : data?.length === 0 ? (
            <div className="flex items-center justify-center h-20 bg-white">
              <span className="text-lg text-myGray">No one yet</span>
            </div>
          ) : (
            data?.map((user, i) => (
              <UserBox
                key={i}
                user={user}
                onClick={() => setIsFollowersModal(null)}
              />
            ))
          )}
        </ul>
      </div>
    </>
  );
};
