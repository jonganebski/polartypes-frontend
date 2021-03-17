import Axios from 'axios';
import { useRef, useState } from 'react';

const GRAPHHOPER_API_KEY = process.env.REACT_APP_GRAPHHOPPER_API_KEY;

export const useGeocoder = (lat?: string, lon?: string) => {
  const [isGeocodeLoading, setIsGeocodeLoading] = useState(false);
  const [isGeocodeErr, setIsGeocodeErr] = useState(false);
  const [geocodeData, setGeocodeData] = useState<any>();
  const timeoutId = useRef<any>();

  const onLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const GEOCODER_END_POINT =
      lat && lon
        ? `https://graphhopper.com/api/1/geocode?reverse=true&point=${lat},${lon}&locale=en&debug=true&key=${GRAPHHOPER_API_KEY}`
        : `https://graphhopper.com/api/1/geocode?q=${value}&locale=en&debug=true&key=${GRAPHHOPER_API_KEY}`;

    clearTimeout(timeoutId.current);

    if (value.length <= 2) {
      setGeocodeData(undefined);
      setIsGeocodeLoading(false);
      return;
    }

    setIsGeocodeLoading(true);
    timeoutId.current = setTimeout(async () => {
      try {
        const { data, status } = await Axios.get(GEOCODER_END_POINT);
        if (400 <= status) {
          setIsGeocodeErr(true);
        } else {
          setIsGeocodeErr(false);
          setGeocodeData(data.hits);
        }
      } catch {
        setIsGeocodeErr(true);
      }
      setIsGeocodeLoading(false);
    }, 2000);
  };

  return {
    geocodeData,
    setGeocodeData,
    isGeocodeErr,
    isGeocodeLoading,
    onLocationInputChange,
  };
};
