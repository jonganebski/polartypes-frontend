import React from 'react';
import { Link } from 'react-router-dom';
import { searchQuery_search_trips } from '../../__generated__/searchQuery';

interface ITripBoxProps {
  trip: searchQuery_search_trips;
}

export const TripBox: React.FC<ITripBoxProps> = ({ trip }) => {
  return (
    <li className="bg-white hover:bg-myGray-lightest">
      <Link
        to={`/${trip.traveler.username}/${trip.id}`}
        className="p-5 flex items-center"
      >
        <div
          style={{
            backgroundImage: `url(${trip.coverUrl})`,
          }}
          className="w-10 h-10 bg-cover bg-center rounded-md"
        ></div>
        <div className="ml-3">
          <span className="block text-myGreen-dark font-semibold">
            {trip.name}
          </span>
          <span className="text-xs text-myGray-dark">
            {trip.traveler.firstName} {trip.traveler.lastName}
          </span>
        </div>
      </Link>
    </li>
  );
};
