import {
  faCalendar,
  faEye,
  faHeart,
  IconDefinition,
} from '@fortawesome/free-regular-svg-icons';
import {
  faAtlas,
  faCamera,
  faPassport,
  faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { readTripQuery_readTrip_trip } from '../__generated__/readTripQuery';
import { calcDistance, getTraveledDays } from '../helpers';

interface ITripStatus {
  count: number;
  icon: IconDefinition;
  unit: string;
}

interface ITripStatusProps {
  trip: readTripQuery_readTrip_trip;
}

export const TripStatus: React.FC<ITripStatusProps> = ({ trip }) => {
  const [tripStatus, setTripStatus] = useState<ITripStatus[]>([]);

  useEffect(() => {
    let imgCount = 0;
    let likeCount = 0;
    let distance = 0;
    const countries = new Set<string>();
    trip.steps.forEach((step) => {
      step.imgUrls && (imgCount += step.imgUrls.length);
      likeCount += step.likesInfo.totalCount;
      countries.add(step.country);
    });
    const traveledDays = getTraveledDays(trip.startDate, trip.endDate);
    trip.steps.length !== 0 &&
      trip.steps.reduce((prev, curr) => {
        const d = calcDistance(prev.lat, prev.lon, curr.lat, curr.lon);
        distance += d;
        return curr;
      });
    setTripStatus([
      { unit: 'kilometer', count: Math.round(distance), icon: faTachometerAlt },
      { unit: 'view', count: trip.viewCount, icon: faEye },
      { unit: 'like', count: likeCount, icon: faHeart },
      { unit: 'day', count: traveledDays, icon: faCalendar },
      { unit: 'photo', count: imgCount, icon: faCamera },
      { unit: 'country', count: countries.size, icon: faPassport },
      { unit: 'step', count: trip.steps.length, icon: faAtlas },
    ]);
  }, [trip.endDate, trip.startDate, trip.steps, trip.viewCount]);

  return (
    <>
      {tripStatus.map((status, i) => {
        const { icon, count, unit } = status;
        return (
          <div key={i}>
            <FontAwesomeIcon icon={icon} className="text-xl" />
            <span className="block mt-1.5 -mb-1.5 font-semibold">
              {count.toLocaleString()}
            </span>
            <span className="text-xs">{count === 0 ? unit : unit + 's'}</span>
          </div>
        );
      })}
    </>
  );
};
