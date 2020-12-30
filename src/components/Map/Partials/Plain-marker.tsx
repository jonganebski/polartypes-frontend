import L from 'leaflet';
import React from 'react';
import { Marker } from 'react-leaflet';
import { useHistory } from 'react-router-dom';
import { useStepIdContext } from '../../../context';
import { readTripsQuery_readTrips_targetUser_trips_steps } from '../../../__generated__/readTripsQuery';

interface IPlainMarker {
  targetUsername: string;
  tripId: string;
  step: readTripsQuery_readTrips_targetUser_trips_steps;
}

export const PlainMarker: React.FC<IPlainMarker> = ({
  targetUsername,
  tripId,
  step,
}) => {
  const history = useHistory();
  const ctx = useStepIdContext();
  const divIcon = L.divIcon({
    className: `border-2 border-white bg-myRed rounded-full`,
    iconSize: L.point(15, 15),
  });
  console.log('ctx: ', ctx);
  const handleClick = () => {
    ctx?.setIdFromMap(step.id + '');
    history.push(`/${targetUsername}/${tripId}`);
  };
  if (!step.lat || !step.lon) {
    return null;
  }

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
