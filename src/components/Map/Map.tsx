import React, { useEffect, useRef, useState } from 'react';
import { useLazyTrip } from '../../hooks/useQuery/useTrip';
import { useLazyTrips } from '../../hooks/useQuery/useTrips';
import { useHistory, useParams } from 'react-router-dom';
import ReactMapGL, {
  Layer,
  Marker,
  Source,
  WebMercatorViewport,
} from 'react-map-gl';
import {} from 'react-map-gl';
import { useFormContext } from 'react-hook-form';
import { ICreateStepFormProps } from '../../pages/Trip';
import { useStepIdContext } from '../../context';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

interface IParams {
  username: string;
  tripId?: string;
}

interface IMapProps {
  isSaveStepModal?: boolean;
}

export const Map: React.FC<IMapProps> = ({ isSaveStepModal }) => {
  const { username: targetUsername, tripId } = useParams<IParams>();
  const history = useHistory();
  const f = useFormContext<ICreateStepFormProps>();
  const { idFromDrag, setIdFromMap } = useStepIdContext();
  const [viewport, setViewport] = useState({
    latitude: 20,
    longitude: 20,
    zoom: 3,
  });
  const [lazyTripQuery, { data: trip, called: tripCalled }] = useLazyTrip();
  const [lazyTripsQuery, { data: trips, called: tripsCalled }] = useLazyTrips();

  useEffect(() => {
    if (tripId) {
      lazyTripQuery({ variables: { input: { tripId: +tripId } } });
    } else {
      lazyTripsQuery({ variables: { input: { targetUsername } } });
    }
  }, [lazyTripQuery, lazyTripsQuery, targetUsername, tripId]);

  const onMapLoaded = () => {
    let bounds: [[number, number], [number, number]];
    if (tripsCalled) {
      const longitudes: number[] = [];
      const latitudes: number[] = [];
      trips?.readTrips.targetUser?.trips.forEach((trip) => {
        trip.steps.forEach((step) => {
          longitudes.push(step.lon);
          latitudes.push(step.lat);
        });
      });
      if (1 < latitudes.length && 1 < longitudes.length) {
        bounds = [
          [Math.min.apply(Math, longitudes), Math.min.apply(Math, latitudes)],
          [Math.max.apply(Math, longitudes), Math.max.apply(Math, latitudes)],
        ];
        console.log(latitudes);
        console.log(longitudes);
        console.log(bounds);
        const { latitude, longitude, zoom } = new WebMercatorViewport({
          width: 800,
          height: 600,
        }).fitBounds(bounds);
        setViewport({ latitude, longitude, zoom: zoom });
      }
    }
    if (tripCalled) {
    }
  };

  useEffect(() => {
    if (tripCalled && trip?.readTrip.trip) {
      const readingStep = trip.readTrip.trip.steps.find(
        (step) => step.id + '' === idFromDrag,
      );
      if (readingStep) {
        setViewport((prev) => ({
          latitude: readingStep.lat,
          longitude: readingStep.lon,
          zoom: prev.zoom,
        }));
      }
    }
  }, [idFromDrag, trip?.readTrip.trip, tripCalled]);
  console.log(viewport);
  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      onLoad={onMapLoaded}
      onViewportChange={(viewport) =>
        setViewport({
          latitude: viewport.latitude,
          longitude: viewport.longitude,
          zoom: viewport.zoom,
        })
      }
      mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
      mapboxApiAccessToken={MAPBOX_TOKEN}
      onClick={(e) => {
        if (isSaveStepModal) {
          const [lng, lat] = e.lngLat;
          f.setValue('lon', lng.toFixed(6), { shouldValidate: true });
          f.setValue('lat', lat.toFixed(6), { shouldValidate: true });
        }
      }}
    >
      {tripsCalled &&
        trips?.readTrips.targetUser?.trips.map((trip, i) => {
          const id = `trip-${trip.id}-route`;
          const coordinates: number[][] = [];
          trip.steps.forEach((step) => coordinates.push([step.lon, step.lat]));
          return (
            <React.Fragment key={i}>
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
                ></Layer>
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
                    onClick={() => {
                      setIdFromMap(step.id + '');
                      history.push(`/${targetUsername}/${trip.id}`);
                    }}
                  ></div>
                </Marker>
              ))}
            </React.Fragment>
          );
        })}
      {tripCalled &&
        trip?.readTrip.trip?.steps.map((step, i) => {
          const id = `step-${step.id}-route`;
          const isReadingThisStep = idFromDrag === step.id + '';
          const coordinates: number[][] = [];
          trip?.readTrip.trip?.steps.forEach((step) =>
            coordinates.push([step.lon, step.lat]),
          );
          return (
            <React.Fragment key={i}>
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
                ></Layer>
              </Source>
              <Marker
                key={i}
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
                  onClick={() => {
                    setIdFromMap(step.id + '');
                    setViewport((prev) => ({
                      latitude: step.lat,
                      longitude: step.lon,
                      zoom: prev.zoom,
                    }));
                  }}
                ></div>
              </Marker>
            </React.Fragment>
          );
        })}
    </ReactMapGL>
  );
};
