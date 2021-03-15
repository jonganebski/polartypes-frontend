import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Redirect, useParams } from 'react-router-dom';
import { CommonHeader } from '../components/Headers/CommonHeader';
import { Loading } from '../components/Loading';
import { Map } from '../components/Map/Map';
import { FollowFollowing } from '../components/Modals/Follow-following';
import { SaveTripModal } from '../components/Modals/Save-trip';
import { SetTimeZoneModal } from '../components/Modals/Set-time-zone';
import { SigninModal } from '../components/Modals/Signin';
import { SignupModal } from '../components/Modals/Signup';
import { Options } from '../components/Options';
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
  const [isSignup, setIsSignup] = useState<boolean | null>(null);
  const [isOption, setIsOption] = useState(false);
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

  if (loading) {
    return <Loading />;
  }
  if (!loading && called && !data?.readTrips.targetUser) {
    return <Redirect to="/" />;
  }
  if (!data?.readTrips.targetUser) {
    return null;
  }
  return (
    <div>
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
      <Options
        userData={userData}
        isOption={isOption}
        setIsOption={setIsOption}
      />
      <Helmet>
        <title>
          {data.readTrips.targetUser.firstName}'s trips | Polartypes
        </title>
      </Helmet>
      <CommonHeader
        userData={userData}
        setIsSignup={setIsSignup}
        setIsOption={setIsOption}
      />
      {isSignup === false && <SigninModal setIsSignup={setIsSignup} />}
      {isSignup === true && <SignupModal setIsSignup={setIsSignup} />}
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
      {data.readTrips.error ? (
        <div>{data.readTrips.error}</div>
      ) : (
        <main className="h-screenExceptHeader grid grid-cols-tripsPage">
          {data.readTrips.targetUser && (
            <section className="overflow-y-scroll">
              <UserIntro
                targetUser={data.readTrips.targetUser}
                isMe={isMe}
                setIsFollowersModal={setIsFollowersModal}
              />
              <TabButtons
                isTabTrips={isTabTrips}
                setIsTabTrips={setIsTabTrips}
              />
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
        </main>
      )}
    </div>
  );
};
