import { useReactiveVar } from '@apollo/client';
import { faBook, faShareAlt, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { isLoggedInVar } from '../../apollo/reactive-variables';
import { useFollow } from '../../hooks/useMutation/useFollow';
import { useUnfollow } from '../../hooks/useMutation/useUnfollow';
import { readTripQuery_readTrip_trip } from '../../__generated__/readTripQuery';
import { Avatar } from '../Avatar';
import { Button } from '../Button';

interface IStepsHeader {
  trip: readTripQuery_readTrip_trip;
  isMe: boolean;
  setEditingTrip: React.Dispatch<
    React.SetStateAction<readTripQuery_readTrip_trip | null>
  >;
  setIsSaveTripModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StepsHeader: React.FC<IStepsHeader> = ({
  trip,
  isMe,
  setEditingTrip,
  setIsSaveTripModal,
}) => {
  const [followMutation] = useFollow();
  const [unfollowMutation] = useUnfollow();
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return (
    <div className="h-tripHeader px-2 flex items-center justify-between">
      <Link to={`/${trip.traveler.username}`} className="flex items-center">
        <Avatar avatarUrl={trip.traveler.avatarUrl ?? null} size={8} />
        <span className="ml-2 text-sm font-semibold text-myGreen-darkest">
          {trip.traveler.firstName + ' ' + trip.traveler.lastName}
        </span>
      </Link>
      <div>
        {isMe && (
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
        {!trip.traveler.isFollowing && !trip.traveler.isMe && isLoggedIn && (
          <Button
            text="Follow"
            type="blue-regular"
            size="sm"
            onClick={() => {
              trip.traveler.slug &&
                followMutation({
                  variables: {
                    input: { slug: trip.traveler.slug },
                  },
                });
            }}
          />
        )}
        {trip.traveler.isFollowing && !trip.traveler.isMe && (
          <Button
            text="Following"
            type="blue-solid"
            size="sm"
            onClick={() => {
              trip.traveler.slug &&
                unfollowMutation({
                  variables: {
                    input: { slug: trip.traveler.slug },
                  },
                });
            }}
          />
        )}
        {isMe && (
          <Button
            text="Trip settings"
            type="white-solid"
            size="sm"
            onClick={() => {
              setEditingTrip(trip);
              setIsSaveTripModal(true);
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
