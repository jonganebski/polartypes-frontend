import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Spinner } from './Loading-spinner';

export const Loading = () => {
  return (
    <div>
      <Helmet>
        <title>Loading... | Polartypes</title>
      </Helmet>
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-myGreen-dark">
        <Spinner size="6xl" />
        <h3 className="mt-40 text-white text-2xl">Loading...</h3>
      </div>
    </div>
  );
};
