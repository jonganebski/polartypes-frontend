import L from 'leaflet';
import React from 'react';
import { Marker, useMap } from 'react-leaflet';
import { readTripQuery_readTrip_trip_steps } from '../../../__generated__/readTripQuery';

interface IImageMarkerProps {
  imgUrl: string;
  step: readTripQuery_readTrip_trip_steps;
  readingStepId?: number | null;
  setReadingStepId?: React.Dispatch<React.SetStateAction<number | null>>;
}

export const ImageMarker: React.FC<IImageMarkerProps> = ({
  imgUrl,
  step,
  readingStepId,
  setReadingStepId,
}) => {
  const map = useMap();
  const isReadingThisStep = readingStepId === step.id;

  const generateIcon = () => {
    const imageIcon = L.icon({
      className: `border-2 border-white rounded-full bg-myGreen-dark bg-cover hover:shadow-imageMarker ${
        isReadingThisStep && 'shadow-imageMarker'
      }`,
      iconUrl: imgUrl,
      iconSize: L.point(30, 30),
    });
    return imageIcon;
  };

  const handleClick = () => {
    map.setView(new L.LatLng(step.lat, step.lon), 5);
    const element = document.getElementById(step.id + '');
    element?.scrollIntoView();
    setReadingStepId && setReadingStepId(step.id);
  };

  return (
    <Marker
      icon={generateIcon()}
      position={[step.lat, step.lon]}
      riseOnHover
      eventHandlers={{
        click: handleClick,
      }}
    />
  );
};
