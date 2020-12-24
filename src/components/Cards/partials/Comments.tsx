import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../Avatar';

export const Comments = () => {
  return (
    <div className="py-4 border-t border-myGray-light">
      <div className="flex items-center">
        <Avatar size={8} />
        <input className="input ml-3 w-full" placeholder="Write a comment..." />
      </div>
      <ul className="py-4 grid gap-y-4">
        <li className="flex items-center">
          <Avatar size={8} />
          <div className="w-full ml-3 text-sm">
            <Link to="#" className="mr-1 text-myGreen-darkest font-semibold">
              Andrea Lucia
            </Link>
            <p className="inline text-myGray-darkest">
              Thanks for sharing! Visiting Africa lake this is a dream! Feel
              like Africa is not a first choice for more travelers. Really
              amazing trip, and inspiring!
            </p>
            <span className="block text-xs text-myGray-dark">23 Aug 2018</span>
          </div>
        </li>
        <li className="flex items-center">
          <Avatar size={8} />
          <div className="w-full ml-3 text-sm">
            <Link to="#" className="mr-1 text-myGreen-darkest font-semibold">
              Andrea Lucia
            </Link>
            <p className="inline text-myGray-darkest">
              Thanks for sharing! Visiting Africa lake this is a dream! Feel
              like Africa is not a first choice for more travelers. Really
              amazing trip, and inspiring!
            </p>
            <span className="block text-xs text-myGray-dark">23 Aug 2018</span>
          </div>
        </li>
      </ul>
    </div>
  );
};
