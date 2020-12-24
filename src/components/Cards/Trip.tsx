import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { months } from 'moment-timezone';
import React from 'react';
import { Link } from 'react-router-dom';
import { readTripsQuery_readTrips_targetUser_trips } from '../../__generated__/readTripsQuery';

interface ITripCardProps {
  trip: readTripsQuery_readTrips_targetUser_trips;
  targetUsername: string;
}

export const TripCard: React.FC<ITripCardProps> = ({
  trip,
  targetUsername,
}) => {
  const dateObject = new Date(trip.startDate);
  const year = dateObject.getFullYear();
  const monthIndex = dateObject.getMonth();
  return (
    <li
      style={{ minHeight: '220px' }}
      className="relative group overflow-hidden"
    >
      <Link
        to={`/${targetUsername}/${trip.id}`}
        className="block w-full h-full"
      >
        <div
          style={{
            backgroundImage:
              'url("andreas-gucklhorn-mawU2PoJWfU-unsplash.jpg")',
          }}
          className="absolute top-0 w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform"
        ></div>
        <div className="relative h-full flex items-center justify-center text-white bg-black bg-opacity-40 pointer-events-none group-hover:bg-opacity-30 ">
          {!trip.endDate && (
            <div className="absolute top-3 left-3 flex items-center">
              <div className="w-2 h-2 mr-1 inline-block rounded-full bg-myRed" />
              <span className="text-white text-sm">Now traveling</span>
            </div>
          )}

          <div className="w-5/6 flex items-center justify-between">
            <h3 className="text-2xl font-semibold">{trip.name}</h3>
            <FontAwesomeIcon icon={faChevronCircleRight} />
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-5/6 flex justify-between text-white">
          <div className="leading-tight">
            <span className="block font-semibold">{year}</span>
            <span className="text-xs">{months()[monthIndex]}</span>
          </div>
          <div className="leading-tight">
            <span className="block font-semibold">{months()[monthIndex]}</span>
            <span className="text-xs">days</span>
          </div>
          <div className="leading-tight">
            <span className="block font-semibold">distance</span>
            <span className="text-xs">kilometers</span>
          </div>
          <div></div>
        </div>
      </Link>
    </li>
  );
};
