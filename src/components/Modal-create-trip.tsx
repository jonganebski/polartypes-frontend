import { gql, useMutation } from '@apollo/client';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import {
  faGlobe,
  faLock,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import {
  createTripMutation,
  createTripMutationVariables,
} from '../__generated__/createTripMutation';
import { Availability } from '../__generated__/globalTypes';
import { readTripsQuery_readTrips_targetUser_trips } from '../__generated__/readTripsQuery';
import { Button } from './Button';
import { Calendar } from './Calendar';
import { FormError } from './Form-error';
import { ModalCloseIcon } from './Icon-close-modal';
import { ModalBackground } from './Modal-background';

const CREATE_TRIP_MUTATION = gql`
  mutation createTripMutation($input: CreateTripInput!) {
    createTrip(input: $input) {
      ok
      error
      tripId
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
  targetUsername: string;
  setIsCreateTrip: React.Dispatch<React.SetStateAction<boolean>>;
  trips?: readTripsQuery_readTrips_targetUser_trips[];
}

interface IFormProps {
  name: string;
  summary: string;
  startDate: string;
  endDate: string;
  availability: Availability;
}

export const CreateTripModal: React.FC<ICreateTripModal> = ({
  targetUsername,
  setIsCreateTrip,
  trips = [],
}) => {
  const history = useHistory();
  const [startDate, setStartDate] = useState<Date | null>(INITIAL_DATE_STATE);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDateCalendar, setIsStartDateCalendar] = useState<
    boolean | null
  >(null);
  const {
    register,
    getValues,
    formState,
    handleSubmit,
    errors,
    setError,
    clearErrors,
  } = useForm<IFormProps>({
    mode: 'onChange',
  });
  useEffect(() => {
    const setEndDateAfterStartDate = () => {
      if (startDate && endDate && endDate.getTime() < startDate.getTime()) {
        setEndDate(startDate);
      }
    };
    const validateTripDates = () => {
      const overlappedTrip = trips.find((trip) => {
        const otherTripStart = new Date(trip.startDate).getTime();
        const otherTripEnd = trip.endDate
          ? new Date(trip.endDate).getTime()
          : Infinity;
        const start = new Date(startDate!).getTime();
        const end = endDate ? new Date(endDate).getTime() : Infinity;
        const isTripsOverlapped = Boolean(
          (otherTripStart < start && start < otherTripEnd) ||
            (otherTripStart < end && end < otherTripEnd) ||
            (start < otherTripStart && otherTripStart < end) ||
            (start < otherTripEnd && otherTripEnd < end),
        );
        return isTripsOverlapped;
      });
      overlappedTrip
        ? setError('startDate', {
            message: `This trip overlaps with "${overlappedTrip.name}". Select a different date.`,
          })
        : clearErrors('startDate');
    };
    setEndDateAfterStartDate();
    validateTripDates();
  }, [clearErrors, endDate, setError, startDate, trips]);
  const onCompleted = (data: createTripMutation) => {
    const {
      createTrip: { ok, error, tripId },
    } = data;
    if (ok && tripId && !error) {
      history.push(`/${targetUsername}/${tripId}`);
    }
  };
  const [createTripMutation, { loading }] = useMutation<
    createTripMutation,
    createTripMutationVariables
  >(CREATE_TRIP_MUTATION, { onCompleted });
  const onSubmit = () => {
    createTripMutation({
      variables: { input: { ...getValues() } },
    });
  };
  return (
    <>
      <ModalBackground onClick={() => setIsCreateTrip(false)} />
      <div className="modal overflow-hidden">
        <ModalCloseIcon onClick={() => setIsCreateTrip(false)} />
        <div className="py-6 text-center text-2xl text-myGreen-darkest font-semibold border-b">
          New Trip
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative grid gap-y-5 max-h-screen80 overflow-y-scroll"
        >
          <div className="p-6 text-xl text-myGreen-darkest font-semibold border-b bg-myGray-lightest">
            Trip details
          </div>
          <div className="grid gap-y-1 px-6">
            <h6 className="font-semibold text-myGreen-darkest">Trip name</h6>
            <input
              ref={register({ required: 'Please enter a name for the trip' })}
              name="name"
              type="text"
              placeholder="e.g. South American Trip"
              className="input"
            />
            {errors.name?.message && <FormError err={errors.name.message} />}
          </div>
          <div className="grid gap-y-1 px-6">
            <h6 className="font-semibold text-myGreen-darkest">Trip summary</h6>
            <textarea
              ref={register({ maxLength: 80 })}
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
                ref={register({
                  required: true,
                  setValueAs: (value) => {
                    const ISO8601_UTC = moment.utc(value).format();
                    if (ISO8601_UTC !== 'Invalid date') {
                      return ISO8601_UTC;
                    }
                    setError('startDate', {
                      message: 'Invalid date format.',
                    });
                  },
                })}
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
                ref={register({
                  setValueAs: (value) => {
                    const ISO8601_UTC = moment.utc(value).format();
                    if (ISO8601_UTC !== 'Invalid date') {
                      return ISO8601_UTC;
                    }
                    return null;
                  },
                })}
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
          <div className="px-6 grid">
            {errors.startDate?.message && (
              <FormError err={errors.startDate.message} />
            )}
          </div>
          <div className="p-6 text-xl text-myGreen-darkest font-semibold border-t border-b bg-myGray-lightest">
            Who can see my trip?
          </div>
          <div className="grid">
            <label className="px-6 pb-6 flex items-center border-b border-myGray-light cursor-pointer">
              <input
                ref={register({ required: true })}
                name="availability"
                value={Availability.Private}
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
                ref={register({ required: true })}
                name="availability"
                value={Availability.Followers}
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
                ref={register({ required: true })}
                name="availability"
                value={Availability.Public}
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
            <Button
              text="Create trip"
              disabled={!formState.isValid}
              loading={loading}
              type="red-solid"
            />
          </div>
        </form>
      </div>
    </>
  );
};
