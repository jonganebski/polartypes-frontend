import L from 'leaflet';
import React from 'react';
import { Marker } from 'react-leaflet';
import { useHistory } from 'react-router-dom';
import { readTripsQuery_readTrips_targetUser_trips_steps } from '../../../__generated__/readTripsQuery';

interface IPlainMarker {
  targetUsername: string;
  tripId: string;
  step: readTripsQuery_readTrips_targetUser_trips_steps;
  setReadingStepId?: React.Dispatch<React.SetStateAction<number | null>>;
}

export const PlainMarker: React.FC<IPlainMarker> = ({
  targetUsername,
  tripId,
  step,
  setReadingStepId,
}) => {
  const history = useHistory();
  const divIcon = L.divIcon({
    className: `border-2 border-white bg-myRed rounded-full`,
    iconSize: L.point(15, 15),
  });

  const handleClick = () => {
    history.push(`/${targetUsername}/${tripId}`);
    const element = document.getElementById(step.id + '');
    element?.scrollIntoView();
    setReadingStepId && setReadingStepId(step.id);
  };

  return (
    <Marker
      icon={divIcon}
      position={[step.lat, step.lon]}
      eventHandlers={{
        click: handleClick,
      }}
    />
  );
};
