import { faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { TripCard } from '../components/Cards/Trip';
import { CommonHeader } from '../components/Headers/CommonHeader';
import { Map } from '../components/Map/Map';
import { CreateTripModal } from '../components/Modals/Create-trip';
import { SetTimeZoneModal } from '../components/Modals/Set-time-zone';
import { Options } from '../components/Options';
import { useFollow } from '../hooks/useFollow';
import { useTrips } from '../hooks/useTrips';
import { useUnfollow } from '../hooks/useUnfollow';
import { useWhoAmI } from '../hooks/useWhoAmI';

interface IPrams {
  username: string;
}

export const Trips = () => {
  const { data: userData } = useWhoAmI();
  const [isCreateTrip, setIsCreateTrip] = useState(false);
  const [isOption, setIsOption] = useState(false);
  const [isAskTimeZone, setIsAskTimeZone] = useState(false);
  const { username: targetUsername } = useParams<IPrams>();
  const { data } = useTrips(targetUsername);
  const [followMutation] = useFollow(data?.readTrips.targetUser?.id);
  const [unfollowMutation] = useUnfollow(data?.readTrips.targetUser?.id);
  const isSelf = targetUsername.toLowerCase() === userData?.whoAmI.slug;
  if (!data?.readTrips.targetUser) {
    return null;
  }
  return (
    <div>
      {isCreateTrip && userData?.whoAmI.timeZone && (
        <CreateTripModal
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
      <Options isOption={isOption} setIsOption={setIsOption} />
      <CommonHeader setIsOption={setIsOption} />
      {data.readTrips.error ? (
        <div>{data.readTrips.error}</div>
      ) : (
        <div className="grid grid-cols-tripsPage">
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
                />
                <Button
                  text={`${data?.readTrips.targetUser?.followings.length} following`}
                  type="white-regular"
                  size="sm"
                />
                {!isSelf &&
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
              <button className="w-1/2 py-4 text-white font-semibold focus:outline-none">
                Trips
              </button>
              <button className="w-1/2 py-4 text-white font-semibold focus:outline-none">
                Statistics
              </button>
            </div>
            <div className="px-3 py-5">
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
          </section>
          <section className="relative z-0 h-screenExceptHeader">
            <Map />
          </section>
        </div>
      )}
    </div>
  );
};
