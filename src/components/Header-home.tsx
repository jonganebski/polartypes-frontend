import { faCompass } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface IHomepageHeaderProps {
  setIsSignup: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const HomepageHeader: React.FC<IHomepageHeaderProps> = ({
  setIsSignup,
}) => {
  return (
    <header className="fixed z-50 top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl py-7 flex items-center justify-between bg-transparent">
      <div className="flex items-center font-medium font-headFont text-myGreen-darkest">
        <FontAwesomeIcon icon={faCompass} className="text-4xl mr-1" />
        <span className="text-3xl font-black">polartypes</span>
      </div>
      <div>
        <button
          onClick={() => {
            setIsSignup(false);
          }}
          className="focus:outline-none font-semibold px-5 py-3 rounded-full text-myGreen-darkest mr-1"
        >
          Sign in
        </button>
        <button
          onClick={() => {
            setIsSignup(true);
          }}
          className="focus:outline-none font-semibold px-5 py-3 rounded-full bg-myRed text-white"
        >
          Create account
        </button>
      </div>
    </header>
  );
};
