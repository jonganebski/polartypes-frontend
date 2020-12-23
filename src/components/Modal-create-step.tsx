import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './Button';
import { ModalCloseIcon } from './Icon-close-modal';

interface ICreateStepModal {
  setIsCreateStepModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateStepModal: React.FC<ICreateStepModal> = ({
  setIsCreateStepModal,
}) => {
  const {} = useForm();
  return (
    <div>
      <div
        onClick={() => setIsCreateStepModal(false)}
        className="absolute z-50 top-0 left-0 w-full h-full bg-myGreen-darkest bg-opacity-80"
      ></div>
      <div className="absolute z-50 top-0 left-0 w-full h-screenExceptHeader overflow-y-scroll">
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-11/12 bg-white rounded-2xl">
          <ModalCloseIcon onClick={() => setIsCreateStepModal(false)} />
          <div className="py-6 text-center text-2xl text-myGreen-darkest font-semibold border-b">
            New Trip
          </div>
          <form className="p-6">
            <section className="p-6 mb-4 grid grid-cols-oneToTwo bg-myGray-dark rounded-2xl">
              <h3 className="text-white font-semibold">Location</h3>
              <div className="rounded-sm overflow-hidden">
                <input
                  placeholder="Enter a location"
                  className="input w-full border-transparent rounded-b-none"
                />
                <div className="p-2 pl-4 flex bg-white text-myGray-darkest text-sm">
                  <div className="flex items-center border-r border-myGray-light">
                    <span className="font-semibold">Lat:</span>
                    <input
                      placeholder="00,000000"
                      className="ml-1 w-full focus:outline-none"
                    />
                  </div>
                  <div className="pl-4 flex items-center">
                    <span className="font-semibold">Lon:</span>
                    <input
                      placeholder="00,000000"
                      className="ml-1 w-full focus:outline-none"
                    />
                  </div>
                  <div className="py-1.5 px-4 rounded-full bg-myBlue text-white">
                    Set
                  </div>
                </div>
              </div>
            </section>
            <section className="p-6 mb-6 grid grid-cols-oneToTwo gap-y-4 rounded-2xl shadow-surround">
              <h3 className="text-myGreen-darkest font-semibold">Step name</h3>
              <div className="flex">
                <input placeholder="-" className="input w-2/3 rounded-r-none" />
                <input
                  readOnly
                  className="px-4 py-3 w-1/3 border border-l-0 border-myGray bg-myGray-light rounded-r-md rounded-l-none focus:outline-none"
                />
              </div>
              <h3 className="text-myGreen-darkest font-semibold">
                Arrival Date & Time
              </h3>
              <div className="flex">
                <input readOnly className="input mr-4 w-full" />
                <input readOnly className="input w-1/3" />
              </div>
              <h3 className="text-myGreen-darkest font-semibold">Your story</h3>
              <textarea
                placeholder="What have you been up to?"
                className="resize-none px-4 py-3 h-48 border border-myGray rounded-sm focus:outline-none focus:border-myBlue"
              />
              <h3 className="text-myGreen-darkest font-semibold">
                Add your photos
              </h3>
              <div className="p-2 gap-3 grid grid-cols-4 border border-myGray rounded-sm">
                <div className="relative pt-square border border-dashed border-myBlue rounded-md">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-p90 pt-p90 bg-myGray-dark rounded-sm"></div>
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    className="absolute top-0 right-0 text-xl cursor-pointer bg-white rounded-full hover:text-myRed"
                  />
                </div>
                <div className="relative pt-square border border-myBlue rounded-md cursor-pointer group hover:bg-myBlue">
                  <FontAwesomeIcon
                    icon={faCamera}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-myBlue text-lg group-hover:text-white"
                  />
                </div>
              </div>
              <input
                type="file"
                className=""
                accept="image/*"
                multiple={true}
              />
            </section>
            <div>
              <Button text="Add step" type="red-solid" className="mr-4" />
              <Button text="Cancel" type="white-solid" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
