import L from 'leaflet';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import { useParams } from 'react-router-dom';
import { sortSteps } from '../helpers';
import { useLazyTrip } from '../hooks/useTrip';
import { useLazyTrips } from '../hooks/useTrips';
import { ICreateStepFormProps } from '../pages/Trip';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

interface IParams {
  username: string;
  tripId?: string;
}

interface IMapProps {
  isSaveStepModal?: boolean;
}

const MyComponent: React.FC<IMapProps> = ({ isSaveStepModal }) => {
  const { setValue } = useFormContext<ICreateStepFormProps>();
  const map = useMapEvents({
    click: (e) => {
      if (isSaveStepModal) {
        console.log(e.latlng);
        const { lat, lng } = e.latlng;
        setValue('lat', lat.toFixed(6), { shouldValidate: true });
        setValue('lon', lng.toFixed(6), { shouldValidate: true });
      }
    },
    locationfound: (location) => {
      console.log('found location: ', location);
    },
  });
  return null;
};

export const Map: React.FC<IMapProps> = ({ isSaveStepModal = false }) => {
  const { username: targetUsername, tripId } = useParams<IParams>();
  const [lazyTripQuery, { data: trip, called: tripCalled }] = useLazyTrip();
  const [lazyTripsQuery, { data: trips, called: tripsCalled }] = useLazyTrips();

  const divIcon = L.divIcon({
    className: 'border-2 border-white bg-myRed rounded-full',
    iconSize: L.point(15, 15),
  });
  const makeImageIcon = (imgUrl: string) => {
    const imageIcon = L.icon({
      className:
        'border-2 border-white rounded-full bg-cover hover:shadow-imageMarker',
      iconUrl: imgUrl,
      iconSize: L.point(30, 30),
    });
    return imageIcon;
  };
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
      <MyComponent isSaveStepModal={isSaveStepModal} />
      <TileLayer
        accessToken={MAPBOX_TOKEN}
        url={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}`}
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
      />
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
      {tripsCalled && trips?.readTrips.targetUser?.trips && (
        <Polyline
          pathOptions={{ color: 'white', weight: 2 }}
          positions={trips?.readTrips.targetUser?.trips.map((trip) => {
            return trip.steps
              .slice()
              .sort(sortSteps)
              .map((step) => {
                const { lat, lon } = step;
                return new L.LatLng(lat, lon);
              });
          })}
        />
      )}
      {tripCalled &&
        trip?.readTrip.trip?.steps.map((step, i) => {
          let imgUrl = '';
          if (step.imgUrls && step.imgUrls.length !== 0) {
            imgUrl = step.imgUrls[0];
          }
          const icon = makeImageIcon(imgUrl);
          return <Marker key={i} icon={icon} position={[step.lat, step.lon]} />;
        })}
      {tripsCalled &&
        trips?.readTrips.targetUser?.trips.map((trip) => {
          return trip.steps.map((step, i) => {
            return (
              <Marker key={i} icon={divIcon} position={[step.lat, step.lon]} />
            );
          });
        })}
    </MapContainer>
  );
};
