import React from 'react';
import { readTripsQuery_readTrips_targetUser } from '../__generated__/readTripsQuery';
import { whoAmIQuery } from '../__generated__/whoAmIQuery';
import { Button } from './Button';
import { TripCard } from './Cards/Trip';

interface ITripsListProps {
  isTabTrips: boolean;
  targetUser: readTripsQuery_readTrips_targetUser;
  isMe: boolean;
  userData?: whoAmIQuery;
  setIsCreateTrip: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAskTimeZone: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TripsList: React.FC<ITripsListProps> = ({
  isTabTrips,
  targetUser,
  isMe,
  userData,
  setIsCreateTrip,
  setIsAskTimeZone,
}) => {
  return (
    <div className={`${isTabTrips ? '' : 'hidden'} px-3 py-5`}>
      <div className="w-full mb-5 flex justify-center">
        {isMe && (
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
        {targetUser?.trips
          .slice()
          .sort(
            (a, b) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
          )
          .map((trip, i) => (
            <TripCard
              key={i}
              targetUsername={targetUser.username}
              trip={trip}
            />
          ))}
      </ul>
    </div>
  );
};
