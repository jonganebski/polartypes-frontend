import React from 'react';
import { Layer, Marker, Source } from 'react-map-gl';
import { useHistory } from 'react-router-dom';
import { useStepIdContext } from '../../../context';
import { readTripsQuery_readTrips_targetUser_trips } from '../../../__generated__/readTripsQuery';

interface ITripRouteProps {
  trip: readTripsQuery_readTrips_targetUser_trips;
  coordinates: number[][];
  username: string;
}

export const TripRoute: React.FC<ITripRouteProps> = ({
  trip,
  coordinates,
  username,
}) => {
  const id = `trip-${trip.id}-route`;
  const { setIdFromMap } = useStepIdContext();
  const history = useHistory();

  const onMarkerClick = (stepId: number) => {
    setIdFromMap(stepId + '');
    history.push(`/${username}/${trip.id}`);
  };

  return (
    <>
      <Source
        id={id}
        type="geojson"
        data={{
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates },
        }}
      >
        <Layer
          id={id}
          source={id}
          type="line"
          paint={{ 'line-color': 'white', 'line-width': 2 }}
        />
      </Source>
      {trip.steps.map((step, i) => (
        <Marker
          key={i}
          latitude={step.lat}
          longitude={step.lon}
          offsetTop={-8}
          offsetLeft={-8}
        >
          <div
            className="w-4 h-4 border-2 border-white bg-myRed rounded-full cursor-pointer"
            onClick={() => onMarkerClick(step.id)}
          ></div>
        </Marker>
      ))}
    </>
  );
};
