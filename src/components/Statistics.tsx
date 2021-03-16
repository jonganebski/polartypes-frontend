import {
  faHeart,
  faMap,
  IconDefinition,
} from '@fortawesome/free-regular-svg-icons';
import { faAtlas, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { TOTAL_COUNTRIES_IN_THE_WORLD } from '../constants';
import { calcDistance, getTraveledDays } from '../helpers';
import { readTripsQuery_readTrips_targetUser_trips } from '../__generated__/readTripsQuery';

interface IStatisticsProps {
  trips: readTripsQuery_readTrips_targetUser_trips[];
  isHidden: boolean;
  isMe: boolean;
}

interface IStatistics {
  count: number;
  icon: IconDefinition;
  unit: string;
}

export const Statistics: React.FC<IStatisticsProps> = ({
  isHidden,
  trips,
  isMe,
}) => {
  const [countriesCount, setCountriesCount] = useState(0);
  const [totalTravelDays, setTotalTravelDays] = useState(0);
  const [statistics, setStatistics] = useState<IStatistics[]>([]);

  useEffect(() => {
    const countries = new Set<string>();
    let totalTravelDays = 0;
    let totalDistance = 0;
    let totlaLikesCount = 0;
    let totalStepsCount = 0;
    trips.forEach((trip) => {
      totalTravelDays += getTraveledDays(trip.startDate, trip.endDate);
      totalStepsCount += trip.steps.length;
      trip.steps.forEach((step) => {
        countries.add(step.country);
        totlaLikesCount += step.likesInfo.totalCount;
      });
      if (trip.steps.length !== 0) {
        trip.steps.reduce((prev, curr) => {
          const d = calcDistance(prev.lat, prev.lon, curr.lat, curr.lon);
          totalDistance += d;
          return curr;
        });
      }
    });
    setCountriesCount(countries.size);
    setTotalTravelDays(totalTravelDays);
    setStatistics([
      { unit: 'trips', count: trips.length, icon: faMap },
      {
        unit: 'kilometers',
        count: Math.round(totalDistance),
        icon: faTachometerAlt,
      },
      { unit: 'likes', count: totlaLikesCount, icon: faHeart },
      { unit: 'steps', count: totalStepsCount, icon: faAtlas },
    ]);
  }, [trips]);
  return (
    <ul
      className={`${
        isHidden ? 'hidden' : ''
      } px-3 py-5 grid gap-y-4 bg-myGray-lightest`}
    >
      <li>
        <h4 className="my-5 mx-2 text-xl text-myGreen-dark font-semibold">
          {isMe ? "You've seen" : 'has seen'}
        </h4>
        <div className="p-4 grid grid-cols-2 gap-2 bg-white rounded-lg border border-myGray-light">
          <div className="p-5 border border-myGray-light rounded-lg">
            <span className="block mb-2 text-3xl font-semibold">
              {countriesCount}
            </span>
            <span className="font-semibold">
              {countriesCount === 1 ? ' country' : ' countries'}
            </span>
          </div>
          <div className="p-5 border border-myGray-light rounded-lg">
            <span className="block mb-2 text-3xl font-semibold">
              {Math.round(
                (countriesCount / TOTAL_COUNTRIES_IN_THE_WORLD) * 100,
              )}
              %
            </span>
            <span className="font-semibold">of the world</span>
          </div>
        </div>
      </li>
      <li>
        <h4 className="my-5 mx-2 text-xl text-myGreen-dark font-semibold">
          Total sum of everythingness
        </h4>
        <div className="p-4 bg-white rounded-lg border border-myGray-light">
          <div className="mb-4 text-myGreen-dark text-lg">
            Traveled for {totalTravelDays} days
          </div>
          <ul className="grid grid-cols-2 gap-2">
            {statistics.map((stat, i) => (
              <li
                key={i}
                className="p-5 flex items-center border border-myGray-light rounded-lg"
              >
                <FontAwesomeIcon
                  icon={stat.icon}
                  className="mr-4 text-myGray-dark text-xl"
                />
                <div>
                  <span className="block text-xl text-myGreen-dark font-semibold">
                    {stat.count.toLocaleString()}
                  </span>
                  <span className="text-sm text-myGray-dark font-semibold">
                    {stat.unit}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </li>
    </ul>
  );
};
