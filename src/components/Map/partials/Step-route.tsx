import React from 'react';
import { Layer, Source } from 'react-map-gl';

interface IStepRouteProps {
  coordinates: number[][];
}

export const StepRoute: React.FC<IStepRouteProps> = ({ coordinates }) => {
  return (
    <Source
      id="step-route"
      type="geojson"
      data={{
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates },
      }}
    >
      <Layer
        id="step-route"
        source="step-route"
        type="line"
        paint={{ 'line-color': 'white', 'line-width': 2 }}
      ></Layer>
    </Source>
  );
};
