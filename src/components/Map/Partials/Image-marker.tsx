import L from 'leaflet';
import React, { useEffect } from 'react';
import { Marker, useMap } from 'react-leaflet';
import { useStepIdContext } from '../../../context';
import { readTripQuery_readTrip_trip_steps } from '../../../__generated__/readTripQuery';

interface IImageMarkerProps {
  imgUrl: string;
  step: readTripQuery_readTrip_trip_steps;
}

export const ImageMarker: React.FC<IImageMarkerProps> = ({ imgUrl, step }) => {
  const map = useMap();
  const { idFromDrag, setIdFromMap } = useStepIdContext();
  const isReadingThisStep = idFromDrag === step.id + '';

  if (isReadingThisStep) {
    map.setView(new L.LatLng(step.lat, step.lon), 7);
  }

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
    setIdFromMap(step.id + '');
    map.setView(new L.LatLng(step.lat, step.lon), 7);
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
