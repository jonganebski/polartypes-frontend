import { gql, useMutation } from '@apollo/client';
import { faCalendarAlt, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {
  faGlobe,
  faLock,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { getBackgroundImage } from '../../helpers';
import { useUpdateTrip } from '../../hooks/useMutation/useUpdateTrip';
import {
  createTripMutation,
  createTripMutationVariables,
} from '../../__generated__/createTripMutation';
import { Availability } from '../../__generated__/globalTypes';
import { readTripQuery_readTrip_trip } from '../../__generated__/readTripQuery';
import { readTripsQuery_readTrips_targetUser_trips } from '../../__generated__/readTripsQuery';
import { whoAmIQuery } from '../../__generated__/whoAmIQuery';
import { Button } from '../Button';
import { FormError } from '../Form-error';
import { NewCalendar } from '../Tooltips/Calendar';
import { ModalBackground } from './partials/Background';
import { ModalCloseIcon } from './partials/CloseIcon';
import { StepImages } from './StepImages';

const CREATE_TRIP_MUTATION = gql`
  mutation createTripMutation($input: CreateTripInput!) {
    createTrip(input: $input) {
      ok
      error
      tripId
    }
  }
`;

interface ICreateTripModal {
  userData: whoAmIQuery;
  setIsCreateTrip: React.Dispatch<React.SetStateAction<boolean>>;
  editingTrip?: readTripQuery_readTrip_trip | null;
  trips?: readTripsQuery_readTrips_targetUser_trips[];
}

export interface ISaveTripFormProps {
  name: string;
  summary: string;
  startDate: string;
  endDate: string;
  availability: Availability;
}

export const SaveTripModal: React.FC<ICreateTripModal> = ({
  userData,
  setIsCreateTrip,
  editingTrip = null,
  trips = [],
}) => {
  const history = useHistory();
  const timeZone = userData.whoAmI.timeZone!;
  const [isStartDateCalendar, setIsStartDateCalendar] = useState<
    boolean | null
  >(null);
  const [isSelectCoverModal, setIsSelectCoverModal] = useState(false);
  const [coverUrl, setCoverUrl] = useState(
    editingTrip ? getBackgroundImage(editingTrip) : '',
  );
  const defaultValues: Partial<ISaveTripFormProps> = editingTrip
    ? {
        startDate: editingTrip.startDate,
        endDate: editingTrip.endDate ?? '',
        name: editingTrip.name,
        summary: editingTrip.summary ?? '',
        availability: editingTrip.availability,
      }
    : { startDate: moment().tz(timeZone).format(), endDate: '' };
  const f = useForm<ISaveTripFormProps>({
    mode: 'onChange',
    defaultValues,
  });
  const { setError, clearErrors, getValues, setValue, register } = f;
  const startDate = getValues('startDate');
  const endDate = getValues('endDate');

  const setEndDateAfterStartDate = useCallback(() => {
    if (endDate) {
      if (
        moment.tz(startDate, timeZone).isAfter(moment.tz(endDate, timeZone))
      ) {
        setValue('endDate', startDate, { shouldValidate: true });
      }
    }
  }, [endDate, setValue, startDate, timeZone]);

  const validateTripDates = useCallback(() => {
    let overlappedTrip: readTripsQuery_readTrips_targetUser_trips | undefined;
    if (endDate) {
      overlappedTrip = trips.find((otherTrip) => {
        if (otherTrip.endDate) {
          const isTripsOverlapped =
            moment(startDate).isBetween(
              moment(otherTrip.startDate),
              moment(otherTrip.endDate),
              'days',
              '[]',
            ) ||
            moment(endDate).isBetween(
              moment(otherTrip.startDate),
              moment(otherTrip.endDate),
              'days',
              '[]',
            ) ||
            moment(otherTrip.startDate).isBetween(
              moment(startDate),
              moment(endDate),
              'days',
              '[]',
            ) ||
            moment(otherTrip.endDate).isBetween(
              moment(startDate),
              moment(endDate),
              'days',
              '[]',
            );
          return isTripsOverlapped;
        } else {
          const isTripsOverlapped = moment(endDate).isSameOrAfter(
            moment(otherTrip.startDate),
            'days',
          );
          return isTripsOverlapped;
        }
      });
    } else {
      overlappedTrip = trips.find((otherTrip) => {
        if (otherTrip.endDate) {
          const isTripsOverlapped =
            moment(otherTrip.startDate).isSameOrAfter(
              moment(startDate),
              'days',
            ) ||
            moment(otherTrip.endDate).isSameOrAfter(moment(startDate), 'days');
          return isTripsOverlapped;
        } else {
          return true;
        }
      });
    }
    overlappedTrip
      ? setError('startDate', {
          message: `This trip overlaps with "${overlappedTrip.name}". Select a different date.`,
        })
      : clearErrors('startDate');
  }, [clearErrors, endDate, setError, startDate, trips]);

  useEffect(() => {
    setEndDateAfterStartDate();
    validateTripDates();
  }, [setEndDateAfterStartDate, validateTripDates]);

  const onCompleted = (data: createTripMutation) => {
    const {
      createTrip: { ok, error, tripId },
    } = data;
    if (ok && tripId && !error) {
      history.push(`/${userData.whoAmI.username}/${tripId}`);
    }
  };
  const [createTripMutation, { loading: createLoading }] = useMutation<
    createTripMutation,
    createTripMutationVariables
  >(CREATE_TRIP_MUTATION, { onCompleted });
  const [updateTripMutation, { loading: updateLoading }] = useUpdateTrip(
    f,
    editingTrip,
    coverUrl,
  );

  const onSubmit = async () => {
    const { endDate, ...values } = getValues();
    if (editingTrip) {
      updateTripMutation({
        variables: {
          input: {
            ...values,
            coverUrl,
            endDate: endDate ? endDate : null,
            tripId: editingTrip.id,
          },
        },
      });
    } else {
      createTripMutation({
        variables: { input: { ...values, endDate: endDate ? endDate : null } },
      });
    }
  };

  const getEndateValue = () => {
    const dateFormat = moment
      .tz(f.watch('endDate'), timeZone)
      .format('DD MMMM YYYY');
    if (!dateFormat || dateFormat === 'Invalid date') {
      return "I don't know";
    }
    return dateFormat;
  };
  return (
    <FormProvider {...f}>
      <ModalBackground onClick={() => setIsCreateTrip(false)} />
      <div className="modal overflow-hidden">
        <ModalCloseIcon onClick={() => setIsCreateTrip(false)} />
        <div className="py-6 text-center text-2xl text-myGreen-darkest font-semibold border-b">
          {editingTrip ? 'Edit trip' : 'New trip'}
        </div>
        <form
          onSubmit={f.handleSubmit(onSubmit)}
          className="relative grid gap-y-5 max-h-screen80 overflow-y-scroll"
        >
          <div className="p-6 text-xl text-myGreen-darkest font-semibold border-b bg-myGray-lightest">
            Trip details
          </div>
          {editingTrip && (
            <div className="px-6 flex items-center">
              <div
                className="mr-8 w-28 h-28 rounded-lg bg-cover bg-center shadow-xl"
                style={{
                  backgroundImage: `url(${coverUrl})`,
                }}
              ></div>
              <Button
                text="Change cover photo"
                isSubmitBtn={false}
                size="sm"
                type="blue-regular"
                onClick={() => setIsSelectCoverModal(true)}
              />
            </div>
          )}
          <div className="grid gap-y-1 px-6">
            <h6 className="font-semibold text-myGreen-darkest">Trip name</h6>
            <input
              ref={register({ required: 'Please enter a name for the trip' })}
              name="name"
              type="text"
              placeholder="e.g. South American Trip"
              className="input"
            />
            {f.errors.name?.message && (
              <FormError err={f.errors.name.message} />
            )}
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
                ref={register({ required: true })}
                name="startDate"
                readOnly
                type="text"
                className="hidden"
              />
              <div
                className="input w-full bg-white cursor-pointer"
                onClick={() =>
                  setIsStartDateCalendar((prev) => (prev ? null : true))
                }
              >
                {moment
                  .tz(f.watch('startDate'), timeZone)
                  .format('DD MMMM YYYY')}
              </div>
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="absolute top-1/2 right-5 transform -translate-y-1/2 text-myBlue text-lg"
              />
              {isStartDateCalendar && (
                <NewCalendar
                  name="startDate"
                  selectedDate={f.getValues('startDate')}
                  timeZone={timeZone}
                />
              )}
            </div>
          </div>
          <div className="grid gap-y-1 px-6">
            <h6 className="font-semibold text-myGreen-darkest">End date</h6>
            <div className="relative">
              <input
                ref={register()}
                name="endDate"
                readOnly
                type="text"
                className="hidden"
              />
              <div
                className="input w-full bg-white cursor-pointer"
                onClick={() =>
                  setIsStartDateCalendar((prev) =>
                    prev === false ? null : false,
                  )
                }
              >
                {getEndateValue()}
              </div>
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="absolute top-1/2 right-5 transform -translate-y-1/2 text-myBlue text-lg"
              />
              {isStartDateCalendar === false && (
                <NewCalendar
                  name="endDate"
                  nullable={true}
                  selectedDate={f.getValues('endDate')}
                  timeZone={timeZone}
                />
              )}
            </div>
          </div>
          <div className="px-6 grid">
            {f.errors.startDate?.message && (
              <FormError err={f.errors.startDate.message} />
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
          <div
            className={`p-6 ${
              editingTrip ? 'flex justify-between' : 'grid'
            } bg-myGray-lightest border-t border-myGray-light rounded-bl-2xl`}
          >
            <Button
              text={editingTrip ? 'Save changes' : 'Create trip'}
              disabled={!f.formState.isValid}
              loading={createLoading || updateLoading}
              type="red-solid"
            />
            {editingTrip && (
              <Button
                text=""
                type="white-solid"
                icon={<FontAwesomeIcon icon={faTrashAlt} className="text-lg" />}
                fontColorClass="text-myRed"
                isSubmitBtn={false}
              />
            )}
          </div>
        </form>
      </div>
      {editingTrip && isSelectCoverModal && (
        <StepImages
          coverUrl={coverUrl}
          setCoverUrl={setCoverUrl}
          steps={editingTrip.steps}
          setIsSelectCoverModal={setIsSelectCoverModal}
        />
      )}
    </FormProvider>
  );
};
