import { faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Redirect, useParams } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { TripCard } from '../components/Cards/Trip';
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
import { useFollow } from '../hooks/useMutation/useFollow';
import { useUnfollow } from '../hooks/useMutation/useUnfollow';
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

  const [lazyWhoAmIQuery, { data: userData }] = useWhoAmI();
  const [lazyTripsQuery, { data, called, loading }] = useLazyTrips();
  useEffect(() => {
    lazyWhoAmIQuery();
  }, [lazyWhoAmIQuery]);
  useEffect(() => {
    lazyTripsQuery({ variables: { input: { targetUsername } } });
  }, [lazyTripsQuery, targetUsername]);

  const [followMutation] = useFollow();
  const [unfollowMutation] = useUnfollow();
  const isSelf = targetUsername.toLowerCase() === userData?.whoAmI.slug;

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
          setIsCreateTrip={setIsCreateTrip}
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
          currentUserId={userData.whoAmI.id}
          users={data.readTrips.targetUser.followings}
          setIsFollowersModal={setIsFollowersModal}
        />
      )}
      {userData && isFollowersModal === true && (
        <FollowFollowing
          isFollowers={true}
          currentUserId={userData.whoAmI.id}
          users={data.readTrips.targetUser.followers}
          setIsFollowersModal={setIsFollowersModal}
        />
      )}
      {data.readTrips.error ? (
        <div>{data.readTrips.error}</div>
      ) : (
        <main className="h-screenExceptHeader grid grid-cols-tripsPage">
          <section className="overflow-y-scroll">
            <div className="relative p-5 flex flex-col items-center">
              <div
                style={{
                  backgroundImage:
                    'url("andreas-gucklhorn-mawU2PoJWfU-unsplash.jpg")',
                  filter: 'blur(2px)',
                  zIndex: -2,
                }}
                className="absolute top-0 w-full h-full bg-cover bg-center"
              ></div>
              <div
                style={{ zIndex: -1 }}
                className="absolute top-0 w-full h-full bg-myGreen-darkest opacity-80"
              ></div>
              <Avatar
                avatarUrl={data?.readTrips.targetUser?.avatarUrl ?? null}
                size={16}
              />
              <h2 className="mt-2 mb-1 text-white text-xl font-semibold">
                {data?.readTrips.targetUser?.firstName}{' '}
                {data?.readTrips.targetUser?.lastName}
              </h2>
              <h6 className="mb-3 text-myGray-dark text-xs">
                {data?.readTrips.targetUser?.city ?? 'Somewhere in the world'}
              </h6>
              {data?.readTrips.targetUser?.about && (
                <p className="mb-3 text-white text-sm text-center">
                  {data?.readTrips.targetUser.about}
                </p>
              )}
              <div className="mt-4">
                <Button
                  text={`${
                    data?.readTrips.targetUser?.followers.length === 1
                      ? data?.readTrips.targetUser?.followers.length +
                        ' follower'
                      : data?.readTrips.targetUser?.followers.length +
                        ' followers'
                  }`}
                  type="white-regular"
                  size="sm"
                  className="mr-2"
                  onClick={() => userData && setIsFollowersModal(true)}
                />
                <Button
                  text={`${data?.readTrips.targetUser?.followings.length} following`}
                  type="white-regular"
                  size="sm"
                  onClick={() => userData && setIsFollowersModal(false)}
                />
                {isLoggedInVar() &&
                  !isSelf &&
                  !data.readTrips.targetUser?.followers.some(
                    (user) => user.id === userData?.whoAmI.id,
                  ) && (
                    <Button
                      text="Follow"
                      type="void"
                      className="text-white border border-myBlue ml-2 hover:bg-myBlue active:bg-myBlue-dark"
                      size="sm"
                      onClick={() => {
                        data.readTrips.targetUser &&
                          followMutation({
                            variables: {
                              input: { id: data.readTrips.targetUser.id },
                            },
                          });
                      }}
                    />
                  )}
                {!isSelf &&
                  data.readTrips.targetUser?.followers.some(
                    (user) => user.id === userData?.whoAmI.id,
                  ) && (
                    <Button
                      text=""
                      type="blue-solid"
                      size="sm"
                      className="ml-2"
                      icon={<FontAwesomeIcon icon={faUserCheck} />}
                      onClick={() => {
                        data.readTrips.targetUser &&
                          unfollowMutation({
                            variables: {
                              input: { id: data.readTrips.targetUser.id },
                            },
                          });
                      }}
                    />
                  )}
              </div>
            </div>
            <div className="bg-gradient-to-br from-myBlue to-myBlue-light">
              <button
                className={`w-1/2 py-4 text-white font-semibold ${
                  !isTabTrips && 'opacity-50'
                } focus:outline-none`}
                onClick={() => setIsTabTrips(true)}
              >
                Trips
              </button>
              <button
                className={`w-1/2 py-4 text-white ${
                  isTabTrips && 'opacity-50'
                } font-semibold focus:outline-none`}
                onClick={() => setIsTabTrips(false)}
              >
                Statistics
              </button>
            </div>
            <div className={`${isTabTrips ? '' : 'hidden'} px-3 py-5`}>
              <div className="w-full mb-5 flex justify-center">
                {isSelf && (
                  <Button
                    text="Add a past, current or future trip"
                    type="blue-regular"
                    size="sm"
                    onClick={() => {
                      userData?.whoAmI.timeZone
                        ? setIsCreateTrip(true)
                        : setIsAskTimeZone(true);
                    }}
                  />
                )}
              </div>
              <ul className="grid gap-y-3">
                {data?.readTrips.targetUser?.trips
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.startDate).getTime() -
                      new Date(a.startDate).getTime(),
                  )
                  .map((trip, i) => (
                    <TripCard
                      key={i}
                      targetUsername={targetUsername}
                      trip={trip}
                    />
                  ))}
              </ul>
            </div>
            <Statistics
              isSelf={isSelf}
              isHidden={isTabTrips}
              trips={data.readTrips.targetUser.trips}
            />
          </section>
          <section className="relative z-0 h-screenExceptHeader">
            <Map />
          </section>
        </main>
      )}
    </div>
  );
};
