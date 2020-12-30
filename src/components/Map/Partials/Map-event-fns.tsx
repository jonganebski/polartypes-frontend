import L from 'leaflet';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useMapEvents } from 'react-leaflet';
import { useDistanceContext } from '../../../context';
import { ICreateStepFormProps } from '../../../pages/Trip';

interface IMapEventFnsProps {
  isSaveStepModal: boolean;
  positions: L.LatLngTuple[];
}

export const MapEventFns: React.FC<IMapEventFnsProps> = ({
  isSaveStepModal,
  positions,
}) => {
  const f = useFormContext<ICreateStepFormProps>();
  const { setDistance } = useDistanceContext();
  const map = useMapEvents({
    click: (e) => {
      if (isSaveStepModal) {
        const { lat, lng } = e.latlng;
        f.setValue('lat', lat.toFixed(6), { shouldValidate: true });
        f.setValue('lon', lng.toFixed(6), { shouldValidate: true });
      }
    },
  });

  useEffect(() => {
    let dist = 0;
    positions.reduce((prevPos, currPos) => {
      const d = map.distance(prevPos, currPos) / 1000;
      dist += Math.round(d);
      return currPos;
    });
    setDistance(dist);
  }, [map, positions, setDistance]);

  return null;
};
