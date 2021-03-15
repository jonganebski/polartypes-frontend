import React, { useEffect, useState } from 'react';
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
    {
      data: followings,
      loading: followingsLoading,
      fetchMore: fetchFollowingsMore,
    },
  ] = useListFollowings();
  const [
    listFollowers,
    {
      data: followers,
      loading: followersLoading,
      fetchMore: fetchFollowersMore,
    },
  ] = useListFollowers();

  const [isFetchMoreLoading, setIsFetchMoreLoading] = useState(false);

  const onScroll = async (e: React.UIEvent<HTMLUListElement, UIEvent>) => {
    const { scrollHeight, offsetHeight, scrollTop } = e.currentTarget;
    const maxScrollTop = scrollHeight - offsetHeight;
    if (isFollowers) {
      if (
        !isFetchMoreLoading &&
        followers?.listFollowers.hasNextPage &&
        maxScrollTop - scrollTop < 250 &&
        fetchFollowersMore
      ) {
        setIsFetchMoreLoading(true);
        await fetchFollowersMore({
          variables: {
            input: { slug, cursorId: followers?.listFollowers.endCursorId },
          },
        });
        setIsFetchMoreLoading(false);
      }
    } else {
      if (
        !isFetchMoreLoading &&
        followings?.listFollowings.hasNextPage &&
        maxScrollTop - scrollTop < 250 &&
        fetchFollowingsMore
      ) {
        setIsFetchMoreLoading(true);
        await fetchFollowingsMore({
          variables: {
            input: { slug, cursorId: followings.listFollowings.endCursorId },
          },
        });
        setIsFetchMoreLoading(false);
      }
    }
  };

  const data = isFollowers
    ? followers?.listFollowers.user?.followers
    : followings?.listFollowings.user?.followings;

  useEffect(() => {
    if (isFollowers) {
      listFollowers({
        variables: { input: { slug } },
      });
    } else {
      listFollowings({
        variables: { input: { slug } },
      });
    }
    // eslint-disable-next-line
  }, [slug]);

  const loading = isFollowers ? followersLoading : followingsLoading;

  return (
    <>
      <ModalBackground onClick={() => setIsFollowersModal(null)} />
      <div className="modal overflow-hidden">
        <ModalCloseIcon onClick={() => setIsFollowersModal(null)} />
        <div className="py-6 max-h-screen70 text-center text-2xl text-myGreen-darkest font-semibold border-b">
          {isFollowers ? 'Followers' : 'Following'}
        </div>
        <ul className="max-h-screen70 overflow-y-scroll" onScroll={onScroll}>
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
