import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Link } from 'react-router-dom';

export const TripCard = () => {
  return (
    <li
      style={{ minHeight: '220px' }}
      className="relative group overflow-hidden"
    >
      <Link to="/" className="block w-full h-full">
        <div
          style={{
            backgroundImage:
              'url("andreas-gucklhorn-mawU2PoJWfU-unsplash.jpg")',
          }}
          className="absolute top-0 w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform"
        ></div>
        <div className="relative h-full flex items-center justify-center text-white bg-black bg-opacity-40 pointer-events-none group-hover:bg-opacity-30 ">
          <div className="w-5/6 flex items-center justify-between">
            <h3 className="text-2xl font-semibold">Trip name</h3>
            <FontAwesomeIcon icon={faChevronCircleRight} />
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-5/6 grid grid-cols-4 text-white">
          <div className="leading-tight">
            <span className="block font-semibold">1997</span>
            <span className="text-xs">July</span>
          </div>
          <div className="leading-tight">
            <span className="block font-semibold">number</span>
            <span className="text-xs">days</span>
          </div>
          <div className="leading-tight">
            <span className="block font-semibold">distance</span>
            <span className="text-xs">kilometers</span>
          </div>
          <div></div>
        </div>
      </Link>
    </li>
  );
};
