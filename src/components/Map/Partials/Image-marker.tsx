import L from 'leaflet';
import React from 'react';
import { Marker, Tooltip, useMap } from 'react-leaflet';
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
    >
      <Tooltip
        className="p-0 border-none bg-transparent"
        opacity={1}
        offset={[10, 0]}
      >
        <div className="rounded-xl overflow-hidden">
          {step.imgUrls && step.imgUrls.length !== 0 && (
            <div
              className="w-60 h-72 bg-cover bg-center bg-myGreen-dark"
              style={{ backgroundImage: `url(${step.imgUrls[0]})` }}
            ></div>
          )}
          <div className="px-5 py-4 bg-white">
            <h5 className="text-myRed-light font-semibold text-sm">
              {step.name}
            </h5>
            <h6 className="text-myGray-dark font-light text-xs">
              {step.country}
            </h6>
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
};
