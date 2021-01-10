import Axios from 'axios';
import moment from 'moment-timezone';
import { readTripsQuery_readTrips_targetUser_trips } from './__generated__/readTripsQuery';

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
  await fetch('http://localhost:4000/aws-s3/delete', {
    method: 'POST',
    body: JSON.stringify({ urls: urls }),
    headers: { 'Content-Type': 'application/json' },
  });
};

export const sortSteps = (a: { arrivedAt: string }, b: { arrivedAt: string }) =>
  new Date(a.arrivedAt).getTime() - new Date(b.arrivedAt).getTime();

export const sleep = (milSec: number) =>
  new Promise((resolve) => {
    return setTimeout(resolve, milSec);
  });

export const getBackgroundImage = (
  trip: readTripsQuery_readTrips_targetUser_trips,
) => {
  if (trip.coverUrl) {
    return trip.coverUrl;
  }
  if (trip.steps.length !== 0) {
    for (let i = 0; i < trip.steps.length; i++) {
      const imgUrls = trip.steps[i].imgUrls;
      if (imgUrls && imgUrls.length !== 0) {
        return imgUrls[0];
      }
    }
  }
  return '/topography.png';
};

export const getTraveledDays = (startDate: string, endDate: string | null) => {
  const startMoment = moment(startDate);
  const endMoment = endDate ? moment(endDate) : moment();
  const diff = moment.duration(startMoment.diff(endMoment)).asDays();
  return Math.ceil(Math.abs(diff));
};

// Converts numeric degrees to radians
const toRad = (Value: number) => {
  return (Value * Math.PI) / 180;
};
export const calcDistance = (
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
) => {
  const R = 6371; // km
  const dLat = toRad(latitude2 - latitude1);
  const dLon = toRad(longitude2 - longitude1);
  const lat1 = toRad(latitude1);
  const lat2 = toRad(latitude2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
