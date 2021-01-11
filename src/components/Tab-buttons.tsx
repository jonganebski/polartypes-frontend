import React from 'react';

interface ITabButtons {
  isTabTrips: boolean;
  setIsTabTrips: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TabButtons: React.FC<ITabButtons> = ({
  isTabTrips,
  setIsTabTrips,
}) => {
  return (
    <div className="bg-gradient-to-br from-myBlue to-myBlue-light">
      <button
        className={`w-1/2 py-4 text-white font-semibold ${
          !isTabTrips && 'opacity-50'
        } focus:outline-none`}
        onClick={() => setIsTabTrips(true)}
      >
        Trips
      </button>
      <button
        className={`w-1/2 py-4 text-white ${
          isTabTrips && 'opacity-50'
        } font-semibold focus:outline-none`}
        onClick={() => setIsTabTrips(false)}
      >
        Statistics
      </button>
    </div>
  );
};
