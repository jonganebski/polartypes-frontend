import Axios from 'axios';
import { useEffect, useRef, useState } from 'react';

const GRAPHHOPER_API_KEY = process.env.REACT_APP_GRAPHHOPPER_API_KEY;

export const useGeocoder = (searchTerm: string, lat?: string, lon?: string) => {
  const [prevSearchTerm, setPrevSearchTerm] = useState('');
  const [geocodeData, setGeocodeData] = useState<any>();
  const [geocodeErr, setGeocodeErr] = useState(false);
  const timeoutId = useRef<any>();
  clearTimeout(timeoutId.current);
  useEffect(() => {
    const GEOCODER_END_POINT =
      lat && lon
        ? `https://graphhopper.com/api/1/geocode?reverse=true&point=${lat},${lon}&locale=en&debug=true&key=${GRAPHHOPER_API_KEY}`
        : `https://graphhopper.com/api/1/geocode?q=${searchTerm}&locale=en&debug=true&key=${GRAPHHOPER_API_KEY}`;
    timeoutId.current = setTimeout(async () => {
      if (
        searchTerm &&
        2 < searchTerm.length &&
        searchTerm !== prevSearchTerm
      ) {
        const { data, status } = await Axios.get(GEOCODER_END_POINT);
        if (400 <= status) {
          setGeocodeErr(true);
        } else {
          setGeocodeErr(false);
          setGeocodeData(data.hits);
          setPrevSearchTerm(searchTerm);
        }
      }
    }, 2000);
  }, [lat, lon, prevSearchTerm, searchTerm]);
  return { geocodeData, setGeocodeData, geocodeErr };
};
