import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ModalCloseIcon } from './Icon-close-modal';
import { ModalBackground } from './Modal-background';
import { Button } from './Button';
import { useForm } from 'react-hook-form';
import { useGeocoder } from '../hooks/useGeocoder';

interface ISetTimeZoneModalProps {
  setIsAskTimeZone: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IFormProps {
  city: string;
  timeZone: string;
}

export const SetTimeZoneModal: React.FC<ISetTimeZoneModalProps> = ({
  setIsAskTimeZone,
}) => {
  const {
    getValues,
    formState,
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<IFormProps>({
    mode: 'onChange',
  });
  const cityInputWatch = watch('city');
  const dataList = useGeocoder(cityInputWatch);
  const onSubmit = () => {
    console.log(getValues());
  };
  return (
    <>
      <ModalBackground onClick={() => setIsAskTimeZone(false)} />
      <div className="modal">
        <ModalCloseIcon onClick={() => setIsAskTimeZone(false)} />
        <div className="py-6 text-center text-2xl text-myGreen-darkest font-semibold border-b">
          Where do you live?
        </div>
        <div className="p-6">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full border-2 border-myBlue text-myBlue text-3xl">
            <FontAwesomeIcon icon={faHome} />
          </div>
          <p className="mb-6 text-myGray-darkest text-center">
            Please set your city. It helps us to determine your home timezone.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col align-center"
          >
            <input
              ref={register({ required: true })}
              name="city"
              list="geocoder"
              type="text"
              placeholder="Enter your city"
              className="input mb-6"
              autoComplete="off"
            />
            <datalist id="geocoder">
              {dataList?.map((data: any, i: number) => {
                const value = `${data.name}, ${data.country}`;
                return <option key={i} value={value} onClick={() => {}} />;
              })}
            </datalist>
            <input
              ref={register({ required: true })}
              name="timeZone"
              className="hidden"
            />
            <Button
              text="Create trip"
              disabled={!formState.isValid}
              type="red-solid"
              className="mx-auto"
            />
          </form>
        </div>
      </div>
    </>
  );
};
