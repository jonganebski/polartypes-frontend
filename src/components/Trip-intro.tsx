import moment from 'moment';
import React from 'react';
import { getBackgroundImage } from '../helpers';
import { readTripQuery_readTrip_trip } from '../__generated__/readTripQuery';
import { TripStatus } from './Trip-status';

interface ITripIntro {
  trip: readTripQuery_readTrip_trip;
}

export const TripIntro: React.FC<ITripIntro> = ({ trip }) => {
  const getDuration = (trip: readTripQuery_readTrip_trip) => {
    const startDate = moment(trip.startDate).format('MMMM YYYY');
    if (trip.endDate) {
      const endDate = moment(trip.endDate).format('MMMM YYYY');
      if (startDate === endDate) {
        return startDate;
      }
      return `${startDate} - ${endDate}`;
    }
    return `${startDate} - Now traveling`;
  };

  return (
    <div
      style={{
        backgroundImage: `url(${getBackgroundImage(trip)})`,
      }}
      className="relative h-96 bg-cover bg-center"
    >
      <div className="absolute w-full h-full flex flex-col items-center justify-between bg-black bg-opacity-50">
        <div className="h-full flex flex-col items-center justify-center">
          <h3 className="mb-1 text-white text-sm font-semibold">
            {getDuration(trip)}
          </h3>
          <h1 className="text-white text-3xl font-semibold">{trip.name}</h1>
        </div>
        <div className="w-full p-3 grid grid-cols-7 text-white text-center bg-myGreen-darkest bg-opacity-70">
          <TripStatus trip={trip} />
        </div>
      </div>
    </div>
  );
};
