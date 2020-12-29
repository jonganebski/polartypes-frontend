import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useMapEvents } from 'react-leaflet';
import { ICreateStepFormProps } from '../../../pages/Trip';

interface IMapEventFnsProps {
  isSaveStepModal: boolean;
}

export const MapEventFns: React.FC<IMapEventFnsProps> = ({
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
  return null;
};
