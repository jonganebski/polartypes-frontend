import {
  faCalendar,
  faEye,
  faHeart,
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
import moment from 'moment';
import { useDistanceContext } from '../context';

interface ITripStatusProps {
  trip: readTripQuery_readTrip_trip;
}

export const TripStatus: React.FC<ITripStatusProps> = ({ trip }) => {
  const { distance } = useDistanceContext();
  const [likeCount, setLikeCount] = useState(0);
  const [imagesCount, setImagesCount] = useState(0);
  const [daysCount, setDaysCount] = useState(0);
  const [countriesCount, setCountriesCount] = useState(0);

  useEffect(() => {
    const getDaysCount = () => {
      let dCount = 0;
      if (trip.endDate) {
        dCount = moment
          .duration(moment(trip.endDate).diff(moment(trip.startDate)))
          .asDays();
      } else {
        dCount = moment
          .duration(moment().diff(moment(trip.startDate)))
          .asDays();
      }
      return Math.floor(dCount);
    };

    let imgCount = 0;
    let lCount = 0;
    const countries = new Set<string>();
    trip.steps.forEach((step) => {
      step.imgUrls && (imgCount += step.imgUrls.length);
      lCount += step.likes.length;
      countries.add(step.country);
    });
    setLikeCount(lCount);
    setImagesCount(imgCount);
    setCountriesCount(countries.size);
    setDaysCount(getDaysCount());
  }, [trip.endDate, trip.startDate, trip.steps]);

  return (
    <>
      <div>
        <FontAwesomeIcon icon={faTachometerAlt} className="text-xl" />
        <span className="block mt-1.5 -mb-1.5 font-semibold">{distance}</span>
        <span className="text-xs">kilometers</span>
      </div>
      <div>
        <FontAwesomeIcon icon={faEye} className="text-xl" />
        <span className="block mt-1.5 -mb-1.5 font-semibold">
          {trip.viewCount}
        </span>
        <span className="text-xs">views</span>
      </div>
      <div>
        <FontAwesomeIcon icon={faHeart} className="text-xl" />
        <span className="block mt-1.5 -mb-1.5 font-semibold">{likeCount}</span>
        <span className="text-xs">likes</span>
      </div>
      <div>
        <FontAwesomeIcon icon={faCalendar} className="text-xl" />
        <span className="block mt-1.5 -mb-1.5 font-semibold">{daysCount}</span>
        <span className="text-xs">{daysCount === 1 ? 'day' : 'days'}</span>
      </div>
      <div>
        <FontAwesomeIcon icon={faCamera} className="text-xl" />
        <span className="block mt-1.5 -mb-1.5 font-semibold">
          {imagesCount}
        </span>
        <span className="text-xs">
          {imagesCount === 1 ? 'photo' : 'photos'}
        </span>
      </div>
      <div>
        <FontAwesomeIcon icon={faPassport} className="text-xl" />
        <span className="block mt-1.5 -mb-1.5 font-semibold">
          {countriesCount}
        </span>
        <span className="text-xs">
          {countriesCount === 1 ? 'country' : 'countries'}
        </span>
      </div>
      <div>
        <FontAwesomeIcon icon={faAtlas} className="text-xl" />
        <span className="block mt-1.5 -mb-1.5 font-semibold">
          {trip.steps.length}
        </span>
        <span className="text-xs">
          {trip.steps.length === 1 ? 'step' : 'steps'}
        </span>
      </div>
    </>
  );
};
