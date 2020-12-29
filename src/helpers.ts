import Axios from 'axios';
import { readTripsQuery_readTrips_targetUser_trips_steps } from './__generated__/readTripsQuery';

interface IGetTimeZoneOutput {
  ok: boolean;
  error?: string;
  timeZone?: string;
}

export const getTimeZone = async (
  lat: string,
  lon: string,
): Promise<IGetTimeZoneOutput> => {
  const BINGMAPS_API_KEY = process.env.REACT_APP_BINGMAPS_API_KEY;
  const END_POINT = `https://dev.virtualearth.net/REST/v1/TimeZone/${lat},${lon}?key=${BINGMAPS_API_KEY}`;
  try {
    console.log('requesting timezone');
    const res = await Axios.get(END_POINT);
    const timeZone =
      res.data?.resourceSets[0]?.resources[0]?.timeZone.ianaTimeZoneId;
    return { ok: true, timeZone };
  } catch {
    return { ok: false, error: 'Failed to get timezone.' };
  }
};

export const deleteFiles = async (urls: string[]) => {
  if (urls.length === 0) {
    return;
  }
  console.log(JSON.stringify({ urls: urls }));
  const response = await fetch('http://localhost:4000/aws-s3/delete', {
    method: 'POST',
    body: JSON.stringify({ urls: urls }),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  console.log(data);
};

export const sortSteps = (
  a: readTripsQuery_readTrips_targetUser_trips_steps,
  b: readTripsQuery_readTrips_targetUser_trips_steps,
) => new Date(a.arrivedAt).getTime() - new Date(b.arrivedAt).getTime();
