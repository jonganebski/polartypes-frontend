import L from 'leaflet';
import React, { useEffect, useState } from 'react';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import { useHistory, useParams } from 'react-router-dom';
import { sortSteps } from '../../helpers';
import { useLazyTrip } from '../../hooks/useTrip';
import { useLazyTrips } from '../../hooks/useTrips';
import { readTripQuery_readTrip_trip_steps } from '../../__generated__/readTripQuery';
import { readTripsQuery_readTrips_targetUser_trips_steps } from '../../__generated__/readTripsQuery';
import { ImageMarker } from './Partials/Image-marker';
import { MapEventFns } from './Partials/Map-event-fns';
import { PlainMarker } from './Partials/Plain-marker';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

interface IParams {
  username: string;
  tripId?: string;
}

interface IMapProps {
  isSaveStepModal?: boolean;
  readingStepId?: number | null;
  setReadingStepId?: React.Dispatch<React.SetStateAction<number | null>>;
}

export const Map: React.FC<IMapProps> = ({
  isSaveStepModal = false,
  readingStepId,
  setReadingStepId,
}) => {
  const { username: targetUsername, tripId } = useParams<IParams>();
  const history = useHistory();
  const [center, setCenter] = useState<L.LatLng | undefined>();
  const [lazyTripQuery, { data: trip, called: tripCalled }] = useLazyTrip();
  const [lazyTripsQuery, { data: trips, called: tripsCalled }] = useLazyTrips();

  useEffect(() => {
    if (tripId) {
      lazyTripQuery({ variables: { input: { tripId: +tripId } } });
    } else {
      lazyTripsQuery({ variables: { input: { targetUsername } } });
    }
  }, [lazyTripQuery, lazyTripsQuery, targetUsername, tripId]);

  useEffect(() => {
    const computeCenter = () => {
      let lat = 0;
      let lon = 0;
      let count = 0;
      tripCalled &&
        trip?.readTrip.trip?.steps.forEach((step) => {
          lat = lat + step.lat;
          lon = lon + step.lon;
          ++count;
        });
      tripsCalled &&
        trips?.readTrips.targetUser?.trips.forEach((trip) => {
          trip.steps.forEach((step) => {
            lat = lat + step.lat;
            lon = lon + step.lon;
            ++count;
          });
        });
      if (count === 0) {
        setCenter(new L.LatLng(0, 0));
      } else {
        setCenter(new L.LatLng(lat / count, lon / count));
      }
    };
    (trips || trip) && computeCenter();
  }, [
    trip,
    tripCalled,
    trips,
    trips?.readTrips.targetUser?.trips,
    tripsCalled,
  ]);

  const getPositionsTripsCalled = (
    steps: readTripsQuery_readTrips_targetUser_trips_steps[],
  ) => {
    return steps
      .slice()
      .sort(sortSteps)
      .map((step) => {
        const { lat, lon } = step;
        return [lat, lon] as L.LatLngTuple;
      });
  };

  const getPositionsTripCalled = (
    steps: readTripQuery_readTrip_trip_steps[],
  ) => {
    return steps
      .slice()
      .sort(sortSteps)
      .map((step) => {
        const { lat, lon } = step;
        return [lat, lon] as L.LatLngTuple;
      });
  };

  const getBounds = () => {
    let bounds: L.LatLngTuple[] = [];
    if (
      tripsCalled &&
      trips?.readTrips.targetUser?.trips &&
      trips?.readTrips.targetUser?.trips.length !== 0
    ) {
      bounds = trips.readTrips.targetUser.trips.flatMap((trip) =>
        getPositionsTripsCalled(trip.steps),
      );
      return bounds;
    }
    if (
      tripCalled &&
      trip?.readTrip.trip?.steps &&
      trip?.readTrip.trip?.steps.length !== 0
    ) {
      bounds = getPositionsTripCalled(trip.readTrip.trip.steps);
      return bounds;
    }
  };

  if (!center) {
    return null;
  }
  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        accessToken={MAPBOX_TOKEN}
        url={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}`}
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
      />
      <MapEventFns
        center={center}
        bounds={getBounds()}
        isSaveStepModal={isSaveStepModal}
      />
      {tripCalled &&
        trip?.readTrip.trip?.steps &&
        trip?.readTrip.trip?.steps.length !== 0 && (
          <Polyline
            pathOptions={{ color: 'white', weight: 2 }}
            positions={getPositionsTripCalled(trip.readTrip.trip.steps)}
          />
        )}
      {tripsCalled &&
        trips?.readTrips.targetUser?.trips &&
        trips?.readTrips.targetUser?.trips.length !== 0 &&
        trips.readTrips.targetUser.trips.map((trip, i) => {
          return (
            <Polyline
              key={i}
              pathOptions={{ color: 'white', weight: 2 }}
              positions={getPositionsTripsCalled(trip.steps)}
              eventHandlers={{
                click: () => {
                  history.push(`/${targetUsername}/${trip.id}`);
                },
              }}
            />
          );
        })}
      {tripCalled &&
        trip?.readTrip.trip?.steps &&
        trip?.readTrip.trip?.steps.length !== 0 &&
        trip?.readTrip.trip?.steps.map((step, i) => {
          let imgUrl = '/blank-profile.webp';
          if (step.imgUrls && step.imgUrls.length !== 0) {
            imgUrl = step.imgUrls[0];
          }
          return (
            <ImageMarker
              key={i}
              imgUrl={imgUrl}
              step={step}
              readingStepId={readingStepId}
              setReadingStepId={setReadingStepId}
            />
          );
        })}
      {tripsCalled &&
        trips?.readTrips.targetUser?.trips &&
        trips?.readTrips.targetUser?.trips.length !== 0 &&
        trips?.readTrips.targetUser?.trips.map((trip) => {
          return trip.steps.map((step, i) => {
            return (
              <PlainMarker
                key={i}
                targetUsername={targetUsername}
                tripId={trip.id + ''}
                step={step}
                setReadingStepId={setReadingStepId}
              />
            );
          });
        })}
    </MapContainer>
  );
};
