import { faCompass } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

interface IHomepageHeaderProps {
  setIsSignup: React.Dispatch<React.SetStateAction<boolean | null>>;
  isAlterHeader: boolean;
}

export const HomepageHeader: React.FC<IHomepageHeaderProps> = ({
  setIsSignup,
  isAlterHeader,
}) => {
  return (
    <header
      className={`fixed z-20 top-0 left-1/2 transform -translate-x-1/2 w-full flex justify-center ${
        isAlterHeader ? 'bg-white shadow-xl' : 'bg-transparent'
      }`}
    >
      <div className="w-full max-w-4xl py-7 flex items-center justify-between">
        <Link
          to="/"
          className={`flex items-center font-medium font-headFont  ${
            isAlterHeader ? 'text-myGreen-darkest' : 'text-white'
          }`}
        >
          <FontAwesomeIcon icon={faCompass} className="text-4xl mr-1" />
          <span className="text-3xl font-black">polartypes</span>
        </Link>
        <div>
          <Button
            onClick={() => {
              setIsSignup(false);
            }}
            text="Sign in"
            type="void"
            fontColorClass={`${
              isAlterHeader ? 'text-myGreen-darkest' : 'text-white'
            }`}
          />
          <Button
            onClick={() => {
              setIsSignup(true);
            }}
            text="Create accout"
            type="red-solid"
          />
        </div>
      </div>
    </header>
  );
};
