import React from 'react';
import { Polyline, useMap } from 'react-leaflet';
import { sortSteps } from '../../../helpers';
import { readTripQuery_readTrip_trip_steps } from '../../../__generated__/readTripQuery';

interface IDynamicPolylines {
  steps: readTripQuery_readTrip_trip_steps[];
}
export const DynamicPolylines: React.FC<IDynamicPolylines> = ({ steps }) => {
  const map = useMap();

  const computeIsAirplane = (
    prevCoord: L.LatLngTuple,
    currCoord: L.LatLngTuple,
    departTime: string,
    arriveTime: string,
  ) => {
    const distanceKm = map.distance(prevCoord, currCoord) / 1000;
    const lapseHour =
      (new Date(arriveTime).getTime() - new Date(departTime).getTime()) /
      1000 /
      60 /
      60;
    const speedPerHour = distanceKm / lapseHour;
    if (300 < speedPerHour) {
      return true;
    }
    return false;
  };

  const getPositions = (steps: readTripQuery_readTrip_trip_steps[]) => {
    const positions: [L.LatLngTuple, L.LatLngTuple, boolean][] = [];
    steps
      .slice()
      .sort(sortSteps)
      .reduce((prevStep, currStep) => {
        const prevCoord = [prevStep.lat, prevStep.lon] as L.LatLngTuple;
        const currCoord = [currStep.lat, currStep.lon] as L.LatLngTuple;
        const isAirplane = computeIsAirplane(
          prevCoord,
          currCoord,
          prevStep.arrivedAt,
          currStep.arrivedAt,
        );
        positions.push([prevCoord, currCoord, isAirplane]);
        return currStep;
      });
    return positions;
  };

  return (
    <>
      {getPositions(steps).map(([prev, curr, isAirplane], i) => {
        return (
          <Polyline
            key={i}
            pathOptions={
              isAirplane
                ? { color: 'white', weight: 2, dashArray: '4' }
                : { color: 'white', weight: 2 }
            }
            positions={[prev, curr]}
          />
        );
      })}
    </>
  );
};
