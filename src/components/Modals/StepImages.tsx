import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { sortSteps } from '../../helpers';
import { readTripQuery_readTrip_trip_steps } from '../../__generated__/readTripQuery';
import { Button } from '../Button';

interface IStepImagesProps {
  coverUrl: string;
  setCoverUrl: React.Dispatch<React.SetStateAction<string>>;
  steps: readTripQuery_readTrip_trip_steps[];
  setIsSelectCoverModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StepImages: React.FC<IStepImagesProps> = ({
  coverUrl,
  setCoverUrl,
  steps,
  setIsSelectCoverModal,
}) => {
  const [selectedUrl, setSelectedUrl] = useState(coverUrl);
  return (
    <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-2xl">
      <div className="py-6 text-center text-2xl text-myGreen-darkest font-semibold border-b">
        'Pick a cover photo'
      </div>
      <div className="p-6 max-h-screen70 bg-myGray-lightest overflow-y-scroll">
        <div
          className="p-6 gap-6 border border-myGray-light bg-white rounded-xl"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(9rem, 1fr))',
          }}
        >
          {steps
            .slice()
            .sort(sortSteps)
            .map((step) => {
              return step.imgUrls?.map((url, i) => {
                return (
                  <div
                    key={i}
                    className="relative h-36 bg-cover bg-center rounded-lg cursor-pointer"
                    style={{ backgroundImage: `url(${url})` }}
                    onClick={() => setSelectedUrl(url)}
                  >
                    {selectedUrl === url && (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="absolute bottom-2 right-2 text-xl text-myBlue bg-white rounded-full"
                      />
                    )}
                  </div>
                );
              });
            })}
        </div>
      </div>
      <div className="p-6 flex justify-end">
        <Button
          text="Cacel"
          isSubmitBtn={false}
          type="white-solid"
          className="mr-4"
        />
        <Button
          text="Selece cover photo"
          isSubmitBtn={false}
          type="red-solid"
          onClick={() => {
            setCoverUrl(selectedUrl);
            setIsSelectCoverModal(false);
          }}
        />
      </div>
    </div>
  );
};
