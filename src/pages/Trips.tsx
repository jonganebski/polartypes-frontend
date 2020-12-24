import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { TripCard } from '../components/Cards/Trip';
import { CommonHeader } from '../components/Headers/CommonHeader';
import { CreateTripModal } from '../components/Modals/Create-trip';
import { SetTimeZoneModal } from '../components/Modals/Set-time-zone';
import { useWhoAmI } from '../hooks/useWhoAmI';
import {
  readTripsQuery,
  readTripsQueryVariables,
} from '../__generated__/readTripsQuery';

const READ_TRIPS_QUERY = gql`
  query readTripsQuery($input: ReadTripsInput!) {
    readTrips(input: $input) {
      ok
      error
      targetUser {
        firstName
        lastName
        about
        city
        avatarUrl
        followers {
          id
        }
        followings {
          id
        }
        trips {
          id
          name
          startDate
          endDate
        }
      }
    }
  }
`;

interface IPrams {
  username: string;
}

export const Trips = () => {
  const { data: userData } = useWhoAmI();
  const [isCreateTrip, setIsCreateTrip] = useState(false);
  const [isAskTimeZone, setIsAskTimeZone] = useState(false);
  const { username: targetUsername } = useParams<IPrams>();
  const { data } = useQuery<readTripsQuery, readTripsQueryVariables>(
    READ_TRIPS_QUERY,
    { variables: { input: { targetUsername: targetUsername.toLowerCase() } } },
  );
  // const isSelf = targetUsername.toLowerCase() === userData?.whoAmI.slug;
  return (
    <div>
      {isCreateTrip && userData && (
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
      <CommonHeader />
      <div className="grid grid-cols-tripsPage">
        <section className="grid overflow-y-scroll">
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
            <Avatar size={16} />
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
                    ? data?.readTrips.targetUser?.followers.length + ' follower'
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
        <section>map</section>
      </div>
    </div>
  );
};
