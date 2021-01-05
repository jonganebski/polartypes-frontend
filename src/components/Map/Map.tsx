import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import ReactMapGL, {
  FlyToInterpolator,
  ViewportProps,
  WebMercatorViewport,
  PointerEvent,
} from 'react-map-gl';
import { useParams } from 'react-router-dom';
import { useStepIdContext } from '../../context';
import { useLazyTrip } from '../../hooks/useQuery/useTrip';
import { useLazyTrips } from '../../hooks/useQuery/useTrips';
import { ICreateStepFormProps } from '../../pages/Trip';
import { StepRoute } from './partials/Step-route';
import { TripRoute } from './partials/Trip-route';

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
  const f = useFormContext<ICreateStepFormProps>();
  const { idFromDrag } = useStepIdContext();
  const [viewport, setViewport] = useState<Partial<ViewportProps>>({
    latitude: 20,
    longitude: 20,
    zoom: 2,
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
    const longitudes: number[] = [];
    const latitudes: number[] = [];
    if (tripsCalled) {
      trips?.readTrips.targetUser?.trips.forEach((trip) => {
        trip.steps.forEach((step) => {
          longitudes.push(step.lon);
          latitudes.push(step.lat);
        });
      });
    }
    if (tripCalled) {
      trip?.readTrip.trip?.steps.forEach((step) => {
        longitudes.push(step.lon);
        latitudes.push(step.lat);
      });
    }
    if (1 < latitudes.length && 1 < longitudes.length) {
      bounds = [
        [Math.min.apply(Math, longitudes), Math.min.apply(Math, latitudes)],
        [Math.max.apply(Math, longitudes), Math.max.apply(Math, latitudes)],
      ];
      const { latitude, longitude, zoom } = new WebMercatorViewport({
        width: 800,
        height: 600,
      }).fitBounds(bounds);
      setViewport({ latitude, longitude, zoom: zoom });
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
          transitionInterpolator: new FlyToInterpolator(),
          transitionDuration: 1000,
        }));
      }
    }
  }, [idFromDrag, trip?.readTrip.trip, tripCalled]);

  const onMapClick = (e: PointerEvent) => {
    if (isSaveStepModal) {
      const [lng, lat] = e.lngLat;
      f.setValue('lon', lng.toFixed(6), { shouldValidate: true });
      f.setValue('lat', lat.toFixed(6), { shouldValidate: true });
    }
  };

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      onLoad={onMapLoaded}
      onViewportChange={(viewport) => setViewport(viewport)}
      mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
      mapboxApiAccessToken={MAPBOX_TOKEN}
      onClick={onMapClick}
    >
      {tripsCalled &&
        trips?.readTrips.targetUser?.trips.map((trip, i) => {
          const coordinates: number[][] = [];
          trip.steps.forEach((step) => coordinates.push([step.lon, step.lat]));
          return (
            <TripRoute
              key={i}
              trip={trip}
              coordinates={coordinates}
              targetUsername={targetUsername}
            />
          );
        })}
      {tripCalled &&
        trip?.readTrip.trip?.steps.map((step, i) => {
          const coordinates: number[][] = [];
          trip?.readTrip.trip?.steps.forEach((step) =>
            coordinates.push([step.lon, step.lat]),
          );
          return (
            <StepRoute
              key={i}
              coordinates={coordinates}
              step={step}
              setViewport={setViewport}
            />
          );
        })}
    </ReactMapGL>
  );
};
