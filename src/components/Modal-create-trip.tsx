import { gql, useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faUserFriends,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import React, { useEffect, useState } from 'react';
import {
  createTripMutation,
  createTripMutationVariables,
} from '../__generated__/createTripMutation';
import { Button } from './Button';
import { FormError } from './Form-error';
import { ModalCloseIcon } from './Icon-close-modal';
import { Calendar } from './Calendar';

const CREATE_TRIP_MUTATION = gql`
  mutation createTripMutation($input: CreateTripInput!) {
    createTrip(input: $input) {
      ok
      error
    }
  }
`;
const dateObj = new Date();
const INITIAL_DATE_STATE = new Date(
  dateObj.getFullYear(),
  dateObj.getMonth(),
  dateObj.getDate(),
);

interface ICreateTripModal {
  setIsCreateTrip: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateTripModal: React.FC<ICreateTripModal> = ({
  setIsCreateTrip,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(INITIAL_DATE_STATE);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDateCalendar, setIsStartDateCalendar] = useState<
    boolean | null
  >(null);
  useEffect(() => {
    if (startDate && endDate && endDate.getTime() < startDate.getTime()) {
      setEndDate(startDate);
    }
  }, [endDate, startDate]);
  const [createTripMutation, {}] = useMutation<
    createTripMutation,
    createTripMutationVariables
  >(CREATE_TRIP_MUTATION);
  return (
    <>
      <div
        className="fixed z-50 top-0 w-screen h-screen bg-myGreen-darkest opacity-80"
        onClick={() => setIsCreateTrip(false)}
      ></div>
      <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl overflow-hidden">
        <ModalCloseIcon onClick={() => setIsCreateTrip(false)} />
        <div className="py-6 text-center text-2xl text-myGreen-darkest font-semibold border-b">
          New Trip
        </div>
        <form className="relative grid gap-y-5 max-h-screen80 overflow-y-scroll">
          <div className="p-6 text-xl text-myGreen-darkest font-semibold border-b bg-myGray-lightest">
            Trip details
          </div>
          <div className="grid gap-y-1 px-6">
            <h6 className="font-semibold text-myGreen-darkest">Trip name</h6>
            <input
              name="name"
              type="text"
              placeholder="e.g. South American Trip"
              className="input"
            />
            <FormError err="Please enter a name for the trip." />
          </div>
          <div className="grid gap-y-1 px-6">
            <h6 className="font-semibold text-myGreen-darkest">Trip summary</h6>
            <textarea
              name="summary"
              maxLength={80}
              placeholder="e.g. An awesome roadtrip through the deserts of Africa with my best friends"
              className="input resize-none h-32"
            />
          </div>
          <div>
            <div className="p-6 text-xl text-myGreen-darkest font-semibold border-t border-b bg-myGray-lightest">
              When?
            </div>
          </div>
          <div className="grid gap-y-1 px-6">
            <h6 className="font-semibold text-myGreen-darkest">Start date</h6>
            <div className="relative">
              <input
                name="startDate"
                readOnly
                value={startDate?.toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                onClick={() =>
                  setIsStartDateCalendar((prev) => (prev ? null : true))
                }
                type="text"
                className="input w-full bg-white cursor-pointer"
              />
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="absolute top-1/2 right-5 transform -translate-y-1/2 text-myBlue text-lg"
              />
              {isStartDateCalendar && (
                <Calendar
                  selectedDate={startDate}
                  setSelectedDate={setStartDate}
                  initialDateState={INITIAL_DATE_STATE}
                />
              )}
            </div>
          </div>
          <div className="grid gap-y-1 px-6">
            <h6 className="font-semibold text-myGreen-darkest">End date</h6>
            <div className="relative">
              <input
                name="endDate"
                readOnly
                value={
                  endDate
                    ? endDate.toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : "I don't know"
                }
                onClick={() =>
                  setIsStartDateCalendar((prev) =>
                    prev === false ? null : false,
                  )
                }
                type="text"
                className="input w-full bg-white cursor-pointer"
              />
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="absolute top-1/2 right-5 transform -translate-y-1/2 text-myBlue text-lg"
              />
              {isStartDateCalendar === false && (
                <Calendar
                  selectedDate={endDate}
                  setSelectedDate={setEndDate}
                  initialDateState={INITIAL_DATE_STATE}
                  effectiveSince={startDate}
                  nullable={true}
                />
              )}
            </div>
          </div>
          <div className="px-6">
            <FormError err='This trip overlaps with "future trip". Select a different date.' />
          </div>
          <div className="p-6 text-xl text-myGreen-darkest font-semibold border-t border-b bg-myGray-lightest">
            Who can see my trip?
          </div>
          <div className="grid">
            <label className="px-6 pb-6 flex items-center border-b border-myGray-light cursor-pointer">
              <input
                name="availability"
                type="radio"
                className="mr-6 w-6 h-6"
              />
              <div>
                <h6 className="mb-1 font-medium text-myGreen-darkest">
                  <FontAwesomeIcon icon={faLock} /> Only me
                </h6>
                <p className="text-myGray-dark text-xs">
                  This trip, including all details like your current location,
                  is only visible to you.
                </p>
              </div>
            </label>
            <label className="p-6 flex items-center cursor-pointer">
              <input
                name="availability"
                type="radio"
                className="mr-6 w-6 h-6"
              />
              <div>
                <h6 className="mb-1 font-medium text-myGreen-darkest">
                  <FontAwesomeIcon icon={faUserFriends} /> My followers
                </h6>
                <p className="text-myGray-dark text-xs">
                  This trip, including all details like your current location,
                  is only visible to you.
                </p>
              </div>
            </label>
            <label className="p-6 flex items-center border-t border-myGray-light cursor-pointer">
              <input
                name="availability"
                type="radio"
                className="mr-6 w-6 h-6"
              />
              <div>
                <h6 className="mb-1 font-medium text-myGreen-darkest">
                  <FontAwesomeIcon icon={faGlobe} /> Public
                </h6>
                <p className="text-myGray-dark text-xs">
                  This trip, including all details like your current location,
                  is only visible to you.
                </p>
              </div>
            </label>
          </div>
          <div className="p-6 grid bg-myGray-lightest border-t border-myGray-light rounded-bl-2xl">
            <Button text="Sign in" type="red-solid" />
          </div>
        </form>
      </div>
    </>
  );
};
