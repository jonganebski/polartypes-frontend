import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Loading } from '../components/Loading';
import { Map } from '../components/Map/Map';
import { FollowFollowing } from '../components/Modals/Follow-following';
import { SaveTripModal } from '../components/Modals/Save-trip';
import { SetTimeZoneModal } from '../components/Modals/Set-time-zone';
import { NotFound } from '../components/NotFound404';
import { Statistics } from '../components/Statistics';
import { TabButtons } from '../components/Tab-buttons';
import { TripsList } from '../components/Trips-list';
import { UserIntro } from '../components/User-intro';
import { useLazyTrips } from '../hooks/useQuery/useTrips';
import { useWhoAmI } from '../hooks/useQuery/useWhoAmI';

interface IPrams {
  username: string;
}

export const Trips = () => {
  const { username: targetUsername } = useParams<IPrams>();
  const [isCreateTrip, setIsCreateTrip] = useState(false);
  const [isAskTimeZone, setIsAskTimeZone] = useState(false);
  const [isTabTrips, setIsTabTrips] = useState(true);
  const [isFollowersModal, setIsFollowersModal] = useState<boolean | null>(
    null,
  );

  const { data: userData } = useWhoAmI();
  const [lazyTripsQuery, { data, called, loading }] = useLazyTrips();

  useEffect(() => {
    lazyTripsQuery({
      variables: { input: { slug: targetUsername.toLowerCase() } },
    });
  }, [lazyTripsQuery, targetUsername]);

  const isMe = data?.readTrips.targetUser?.isMe ?? false;

  if (loading || !called) {
    return <Loading />;
  }
  if (!data?.readTrips.targetUser) {
    return <NotFound />;
  }
  return (
    <>
      {isCreateTrip && userData?.whoAmI.timeZone && (
        <SaveTripModal
          userData={userData}
          setIsSaveTripModal={setIsCreateTrip}
          trips={data?.readTrips.targetUser?.trips}
        />
      )}
      {isAskTimeZone && (
        <SetTimeZoneModal
          setIsAskTimeZone={setIsAskTimeZone}
          setIsCreateTrip={setIsCreateTrip}
        />
      )}
      {userData && isFollowersModal === false && (
        <FollowFollowing
          isFollowers={false}
          slug={targetUsername.toLocaleLowerCase()}
          setIsFollowersModal={setIsFollowersModal}
        />
      )}
      {userData && isFollowersModal === true && (
        <FollowFollowing
          isFollowers={true}
          slug={targetUsername.toLocaleLowerCase()}
          setIsFollowersModal={setIsFollowersModal}
        />
      )}
      <Layout
        className="grid grid-cols-tripsPage"
        title={`${data.readTrips.targetUser.firstName}'s trips`}
      >
        {data.readTrips.targetUser && (
          <section className="overflow-y-scroll">
            <UserIntro
              targetUser={data.readTrips.targetUser}
              isMe={isMe}
              setIsFollowersModal={setIsFollowersModal}
            />
            <TabButtons isTabTrips={isTabTrips} setIsTabTrips={setIsTabTrips} />
            <TripsList
              isMe={isMe}
              isTabTrips={isTabTrips}
              targetUser={data.readTrips.targetUser}
              userData={userData}
              setIsCreateTrip={setIsCreateTrip}
              setIsAskTimeZone={setIsAskTimeZone}
            />
            <Statistics
              isMe={isMe}
              isHidden={isTabTrips}
              trips={data.readTrips.targetUser.trips}
            />
          </section>
        )}
        <section className="relative z-0 h-screenExceptHeader">
          <Map />
        </section>
      </Layout>
    </>
  );
};
