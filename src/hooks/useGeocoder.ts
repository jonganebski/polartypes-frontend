import Axios from 'axios';
import { useEffect, useRef, useState } from 'react';

const GRAPHHOPER_API_KEY = process.env.REACT_APP_GRAPHHOPPER_API_KEY;

export const useGeocoder = (searchTerm: string, lat?: string, lon?: string) => {
  const [dataList, setDataList] = useState<any>();
  const timeoutId = useRef<any>();
  clearTimeout(timeoutId.current);
  useEffect(() => {
    const GEOCODER_END_POINT =
      lat && lon
        ? `https://graphhopper.com/api/1/geocode?reverse=true&point=${lat},${lon}&locale=en&debug=true&key=${GRAPHHOPER_API_KEY}`
        : `https://graphhopper.com/api/1/geocode?q=${searchTerm}&locale=en&debug=true&key=${GRAPHHOPER_API_KEY}`;
    timeoutId.current = setTimeout(async () => {
      if (searchTerm && 2 < searchTerm.length) {
        const response = await Axios.get(GEOCODER_END_POINT);
        setDataList(response.data.hits);
      }
    }, 2000);
  }, [lat, lon, searchTerm]);
  return dataList;
};
