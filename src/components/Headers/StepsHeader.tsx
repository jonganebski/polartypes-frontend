import { faBook, faShareAlt, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { isLoggedInVar } from '../../apollo';
import { useFollow } from '../../hooks/useMutation/useFollow';
import { useUnfollow } from '../../hooks/useMutation/useUnfollow';
import { readTripQuery_readTrip_trip } from '../../__generated__/readTripQuery';
import { Avatar } from '../Avatar';
import { Button } from '../Button';

interface IStepsHeader {
  trip: readTripQuery_readTrip_trip;
  currentUserId?: number;
  isSelf: boolean;
  setEditingTrip: React.Dispatch<
    React.SetStateAction<readTripQuery_readTrip_trip | null>
  >;
  setIsEditTripModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StepsHeader: React.FC<IStepsHeader> = ({
  trip,
  isSelf,
  currentUserId,
  setEditingTrip,
  setIsEditTripModal,
}) => {
  const [followMutation] = useFollow();
  const [unfollowMutation] = useUnfollow();
  return (
    <div className="h-tripHeader px-2 flex items-center justify-between">
      <Link to={`/${trip.traveler.username}`} className="flex items-center">
        <Avatar avatarUrl={trip.traveler.avatarUrl ?? null} size={8} />
        <span className="ml-2 text-sm font-semibold text-myGreen-darkest">
          {trip.traveler.firstName + ' ' + trip.traveler.lastName}
        </span>
      </Link>
      <div>
        {isSelf && (
          <Button
            text="Create Travel Book"
            type="white-solid"
            size="sm"
            className="mr-2"
            icon={
              <FontAwesomeIcon
                icon={faBook}
                className="mr-2 text-myBlue text-sm"
              />
            }
          />
        )}
        <Button
          text="Share"
          type="white-solid"
          size="sm"
          className="mr-2"
          icon={
            <FontAwesomeIcon
              icon={faShareAlt}
              className="mr-2 text-myBlue text-sm"
            />
          }
        />
        {isLoggedInVar() &&
          !isSelf &&
          !trip.traveler.followers.some(
            (follower) => follower.id === currentUserId,
          ) && (
            <Button
              text="Follow"
              type="blue-regular"
              size="sm"
              onClick={() => {
                trip.traveler.id &&
                  followMutation({
                    variables: {
                      input: { id: trip.traveler.id },
                    },
                  });
              }}
            />
          )}
        {!isSelf &&
          trip.traveler.followers.some(
            (follower) => follower.id === currentUserId,
          ) && (
            <Button
              text="Following"
              type="blue-solid"
              size="sm"
              onClick={() => {
                trip.traveler.id &&
                  unfollowMutation({
                    variables: {
                      input: { id: trip.traveler.id },
                    },
                  });
              }}
            />
          )}
        {isSelf && (
          <Button
            text="Trip settings"
            type="white-solid"
            size="sm"
            onClick={() => {
              setEditingTrip(trip);
              setIsEditTripModal(true);
            }}
            icon={
              <FontAwesomeIcon
                icon={faCog}
                className="mr-2 text-myBlue text-sm"
              />
            }
          />
        )}
      </div>
    </div>
  );
};
