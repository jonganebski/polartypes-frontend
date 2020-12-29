import L from 'leaflet';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useMapEvents } from 'react-leaflet';
import { ICreateStepFormProps } from '../../../pages/Trip';

interface IMapEventFnsProps {
  center: L.LatLng | undefined;
  isSaveStepModal: boolean;
  bounds: L.LatLngTuple[] | undefined;
}

export const MapEventFns: React.FC<IMapEventFnsProps> = ({
  bounds,
  isSaveStepModal,
}) => {
  const f = useFormContext<ICreateStepFormProps>();
  const map = useMapEvents({
    click: (e) => {
      if (isSaveStepModal) {
        const { lat, lng } = e.latlng;
        f.setValue('lat', lat.toFixed(6), { shouldValidate: true });
        f.setValue('lon', lng.toFixed(6), { shouldValidate: true });
      }
    },
  });
  if (bounds && bounds?.length !== 0) {
    map.fitBounds(bounds);
  } else {
    map.setView([20, 20], 3);
  }

  return null;
};
