import Axios from 'axios';

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

export const formatDate = (date: Date | null, monthType: 'long' | 'short') => {
  const format = date?.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: monthType,
    day: 'numeric',
  });
  return format;
};