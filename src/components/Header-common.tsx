import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Logo } from './Logo';
import { Avatar } from './Avatar';
import { Link } from 'react-router-dom';

export const CommonHeader = () => {
  return (
    <header className="flex justify-between bg-myGreen-darkest">
      <div className="p-3 flex items-center">
        <Logo usage="common" />
        <form className="relative ml-4 w-80">
          <input
            type="text"
            placeholder="Explore people, trips or locations..."
            className="w-full pl-9 py-1.5 text-white text-sm bg-transparent border border-myGray-darkest rounded-full hover:border-myGray-dark focus:border-myGray-dark focus:outline-none"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-2 left-3 text-white"
          />
        </form>
      </div>
      <div className="grid grid-cols-3 gap-x-px bg-myGray-darkest text-white text-sm font-semibold">
        <Link
          to={`/username`}
          className="h-full px-4 flex items-center justify-center border-b-4 border-myRed text-center bg-myGreen-darkest"
        >
          <Avatar size={8} />
          <span className="ml-3">FirstName</span>
        </Link>
        <div className="h-full px-4 flex items-center justify-center bg-myGreen-darkest">
          Travel Books
        </div>
        <div className="h-full px-4 flex items-center justify-center bg-myGreen-darkest">
          <span className="mr-3">Options</span>
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>
    </header>
  );
};
