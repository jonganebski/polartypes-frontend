import React from 'react';
import { readTripsQuery_readTrips_targetUser } from '../__generated__/readTripsQuery';
import { whoAmIQuery_whoAmI_user } from '../__generated__/whoAmIQuery';
import { Button } from './Button';
import { TripCard } from './Cards/Trip';

interface ITripsListProps {
  setIsAskTimeZone: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreateTrip: React.Dispatch<React.SetStateAction<boolean>>;
  targetUser: readTripsQuery_readTrips_targetUser;
  me: whoAmIQuery_whoAmI_user | null | undefined;
  isTabTrips: boolean;
  isMe: boolean;
}

export const TripsList: React.FC<ITripsListProps> = ({
  isTabTrips,
  targetUser,
  isMe,
  me,
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
              me?.timeZone ? setIsCreateTrip(true) : setIsAskTimeZone(true);
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
