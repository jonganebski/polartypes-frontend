import Axios from 'axios';
import { useEffect, useRef, useState } from 'react';

const BINGMAPS_API_KEY = process.env.REACT_APP_BINGMAPS_API_KEY;

export const useTimeZone = (searchTerm: string) => {
  const [data, setData] = useState<any>();
  const timeoutId = useRef<any>();
  useEffect(() => {
    setData(null);
    clearTimeout(timeoutId.current);
    const END_POINT = `https://dev.virtualearth.net/REST/v1/TimeZone/?query=${searchTerm}&key=${BINGMAPS_API_KEY}`;
    if (searchTerm && 2 < searchTerm.length) {
      timeoutId.current = setTimeout(async () => {
        Axios.get(END_POINT).then((res) => setData(res.data));
      }, 1500);
    }
  }, [searchTerm]);
  console.log(data);
  return data?.resourceSets[0]?.resources[0]?.timeZoneAtLocation;
};
