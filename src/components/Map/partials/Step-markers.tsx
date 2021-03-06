import React, { useState } from 'react';
import { Marker, Popup, ViewportProps } from 'react-map-gl';
import { useStepIdContext } from '../../../context';
import { readTripQuery_readTrip_trip_steps } from '../../../__generated__/readTripQuery';

interface IStepMarkersProps {
  step: readTripQuery_readTrip_trip_steps;
  setViewport: (value: React.SetStateAction<Partial<ViewportProps>>) => void;
}

export const StepMarkers: React.FC<IStepMarkersProps> = ({
  step,
  setViewport,
}) => {
  const { idFromDrag, setIdFromMap } = useStepIdContext();
  const [isPopup, setIsPopup] = useState(false);
  const isReadingThisStep = idFromDrag === step.id + '';

  const onMarkerClick = () => {
    setIdFromMap(step.id + '');
    setViewport((prev) => ({
      latitude: step.lat,
      longitude: step.lon,
      zoom: prev.zoom,
    }));
  };

  return (
    <>
      <Marker
        latitude={step.lat}
        longitude={step.lon}
        offsetTop={-16}
        offsetLeft={-16}
      >
        <div
          className={`w-8 h-8 border-2 border-white rounded-full bg-myGreen-dark bg-cover bg-center cursor-pointer hover:shadow-imageMarker ${
            isReadingThisStep && 'shadow-imageMarker'
          }`}
          style={{
            backgroundImage:
              step.imgUrls && step.imgUrls.length !== 0
                ? `url(${step.imgUrls[0]})`
                : '',
          }}
          onClick={onMarkerClick}
          onMouseOver={() => setIsPopup(true)}
          onMouseOut={() => setIsPopup(false)}
        ></div>
      </Marker>
      {isPopup && (
        <Popup
          latitude={step.lat}
          longitude={step.lon}
          closeButton={false}
          className="relative z-10"
        >
          <div className="w-60 h-90">
            {step.imgUrls && step.imgUrls.length !== 0 && (
              <div
                className="w-full h-72 bg-cover bg-center bg-myGreen-dark"
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
        </Popup>
      )}
    </>
  );
};
