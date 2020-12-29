import L from 'leaflet';
import React, { useEffect } from 'react';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import { useHistory, useParams } from 'react-router-dom';
import { sortSteps } from '../../helpers';
import { useLazyTrip } from '../../hooks/useTrip';
import { useLazyTrips } from '../../hooks/useTrips';
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
  const [lazyTripQuery, { data: trip, called: tripCalled }] = useLazyTrip();
  const [lazyTripsQuery, { data: trips, called: tripsCalled }] = useLazyTrips();

  useEffect(() => {
    if (tripId) {
      lazyTripQuery({ variables: { input: { tripId: +tripId } } });
    } else {
      lazyTripsQuery({ variables: { input: { targetUsername } } });
    }
  }, [lazyTripQuery, lazyTripsQuery, targetUsername, tripId]);

  return (
    <MapContainer
      center={[40.8054, -74.0241]}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        accessToken={MAPBOX_TOKEN}
        url={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}`}
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
      />
      <MapEventFns isSaveStepModal={isSaveStepModal} />
      {tripCalled && trip?.readTrip.trip && (
        <Polyline
          pathOptions={{ color: 'white', weight: 2 }}
          positions={trip.readTrip.trip.steps
            .slice()
            .sort(sortSteps)
            .map((step) => {
              const { lat, lon } = step;
              return new L.LatLng(lat, lon);
            })}
        />
      )}
      {tripsCalled &&
        trips?.readTrips.targetUser?.trips &&
        trips.readTrips.targetUser.trips.map((trip) => {
          return (
            <Polyline
              pathOptions={{ color: 'white', weight: 2 }}
              positions={trip.steps
                .slice()
                .sort(sortSteps)
                .map((step) => {
                  const { lat, lon } = step;
                  return new L.LatLng(lat, lon);
                })}
              eventHandlers={{
                click: () => {
                  history.push(`/${targetUsername}/${trip.id}`);
                },
              }}
            />
          );
        })}
      {tripCalled &&
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
