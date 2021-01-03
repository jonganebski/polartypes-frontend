import {
  faBook,
  faCog,
  faHome,
  faShareAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { AddStepButton } from '../components/Button-add-step';
import { StepCard } from '../components/Cards/Step';
import { CommonHeader } from '../components/Headers/CommonHeader';
import { Map } from '../components/Map/Map';
import { CreateTripModal } from '../components/Modals/Create-trip';
import { SaveStepModal } from '../components/Modals/Save-step';
import { Options } from '../components/Options';
import { TripStatus } from '../components/Trip-status';
import { useStepIdContext } from '../context';
import { getBackgroundImage, sortSteps } from '../helpers';
import { useFollow } from '../hooks/useMutation/useFollow';
import { useTrip } from '../hooks/useQuery/useTrip';
import { useTrips } from '../hooks/useQuery/useTrips';
import { useUnfollow } from '../hooks/useMutation/useUnfollow';
import { useWhoAmI } from '../hooks/useQuery/useWhoAmI';
import {
  readTripQuery_readTrip_trip,
  readTripQuery_readTrip_trip_steps,
} from '../__generated__/readTripQuery';

interface IParams {
  username: string;
  tripId: string;
}

export interface ICreateStepFormProps {
  location: string;
  name: string;
  country: string;
  lat: string;
  lon: string;
  story: string;
  arrivedAt: string;
  timeZone: string;
}

export const Trip = () => {
  const articleRef = useRef<HTMLElement | null>(null);
  const { username: targetUsername, tripId } = useParams<IParams>();
  const { data: userData } = useWhoAmI();
  const ctx = useStepIdContext();
  const [isEditTripModal, setIsEditTripModal] = useState(false);
  const [isSaveStepModal, setIsSaveStepModal] = useState(false);
  const [isOption, setIsOption] = useState(false);
  const [
    editingTrip,
    setEditingTrip,
  ] = useState<readTripQuery_readTrip_trip | null>(null);
  const [
    editingStep,
    setEditingStep,
  ] = useState<readTripQuery_readTrip_trip_steps | null>(null);
  const [belowStepDate, setBelowStepDate] = useState<string>('');
  const [belowStepTimeZone, setBelowStepTimeZone] = useState('');
  const f = useForm<ICreateStepFormProps>({
    mode: 'onChange',
    defaultValues: {},
  });
  const { data } = useTrip(tripId);
  const { data: tripsData } = useTrips(targetUsername);
  const [followMutation] = useFollow(data?.readTrip.trip?.traveler.id);
  const [unfollowMutation] = useUnfollow(data?.readTrip.trip?.traveler.id);
  const isSelf = data?.readTrip.trip?.traveler.id === userData?.whoAmI.id;
  const startDateData = data?.readTrip.trip?.startDate;
  const endDateData = data?.readTrip.trip?.endDate;
  const timeZoneData = data?.readTrip.trip?.traveler.timeZone;
  useEffect(() => {
    if (!isSaveStepModal) {
      setEditingStep(null);
    }
  }, [isSaveStepModal]);

  const readingStepId = ctx.idFromMap;
  const element = document.getElementById(readingStepId);
  useEffect(() => {
    if (readingStepId) {
      element?.scrollIntoView();
    }
  }, [element, readingStepId]);
  if (!data?.readTrip.trip) {
    return null;
  }
  return (
    <FormProvider {...f}>
      <Options isOption={isOption} setIsOption={setIsOption} />
      <CommonHeader setIsOption={setIsOption} />
      {data.readTrip.error ? (
        <div>{data.readTrip.error}</div>
      ) : (
        <main className="h-screenExceptHeader flex">
          <section className="relative w-1/2 h-full min-w-px600">
            {isSaveStepModal && isSelf && (
              <SaveStepModal
                tripId={tripId}
                tripStartDate={data.readTrip.trip.startDate}
                tripEndDate={data.readTrip.trip.endDate}
                belowStepDate={belowStepDate}
                belowStepTimeZone={belowStepTimeZone}
                setIsSaveStepModal={setIsSaveStepModal}
                editingStep={editingStep}
              />
            )}
            {isEditTripModal && userData && isSelf && (
              <CreateTripModal
                userData={userData}
                setIsCreateTrip={setIsEditTripModal}
                editingTrip={editingTrip}
                trips={tripsData?.readTrips.targetUser?.trips.filter(
                  (trip) => trip.id !== data.readTrip.trip?.id,
                )}
              />
            )}
            <div className="h-tripHeader px-2 flex items-center justify-between">
              <Link
                to={`/${data.readTrip.trip.traveler.username}`}
                className="flex items-center"
              >
                <Avatar
                  avatarUrl={data.readTrip.trip.traveler.avatarUrl ?? null}
                  size={8}
                />
                <span className="ml-2 text-sm font-semibold text-myGreen-darkest">
                  {data.readTrip.trip.traveler.firstName +
                    ' ' +
                    data.readTrip.trip.traveler.lastName}
                </span>
              </Link>
              <div>
                {isSelf && (
                  <Button
                    text="Create Travel Book"
                    type="white-solid"
                    size="sm"
                    className="mr-2"
                    icon={
                      <FontAwesomeIcon
                        icon={faBook}
                        className="mr-2 text-myBlue text-sm"
                      />
                    }
                  />
                )}
                <Button
                  text="Share"
                  type="white-solid"
                  size="sm"
                  className="mr-2"
                  icon={
                    <FontAwesomeIcon
                      icon={faShareAlt}
                      className="mr-2 text-myBlue text-sm"
                    />
                  }
                />
                {!isSelf &&
                  !data.readTrip.trip.traveler.followers.some(
                    (follower) => follower.id === userData?.whoAmI.id,
                  ) && (
                    <Button
                      text="Follow"
                      type="blue-regular"
                      size="sm"
                      onClick={() => {
                        data.readTrip.trip?.traveler.id &&
                          followMutation({
                            variables: {
                              input: { id: data.readTrip.trip?.traveler.id },
                            },
                          });
                      }}
                    />
                  )}
                {!isSelf &&
                  data.readTrip.trip.traveler.followers.some(
                    (follower) => follower.id === userData?.whoAmI.id,
                  ) && (
                    <Button
                      text="Following"
                      type="blue-solid"
                      size="sm"
                      onClick={() => {
                        data.readTrip.trip?.traveler.id &&
                          unfollowMutation({
                            variables: {
                              input: { id: data.readTrip.trip?.traveler.id },
                            },
                          });
                      }}
                    />
                  )}
                {isSelf && (
                  <Button
                    text="Trip settings"
                    type="white-solid"
                    size="sm"
                    onClick={() => {
                      setEditingTrip(data.readTrip.trip);
                      setIsEditTripModal(true);
                    }}
                    icon={
                      <FontAwesomeIcon
                        icon={faCog}
                        className="mr-2 text-myBlue text-sm"
                      />
                    }
                  />
                )}
              </div>
            </div>
            <article ref={articleRef} className="h-tripBody overflow-y-scroll">
              <div
                style={{
                  backgroundImage: `url(${getBackgroundImage(
                    data.readTrip.trip,
                  )})`,
                }}
                className="relative h-96 bg-cover bg-center"
              >
                <div className="absolute w-full h-full flex flex-col items-center justify-between bg-black bg-opacity-50">
                  <div className="h-full flex flex-col items-center justify-center">
                    <h3 className="mb-1 text-white text-sm font-semibold">
                      {moment(data.readTrip.trip.startDate).format(
                        'MMMM YYYY',
                      ) ===
                      moment(data.readTrip.trip.endDate).format('MMMM YYYY')
                        ? moment(data.readTrip.trip.startDate).format(
                            'MMMM YYYY',
                          )
                        : moment(data.readTrip.trip.startDate).format(
                            'MMMM YYYY',
                          ) +
                          ' - ' +
                          moment(data.readTrip.trip.endDate).format(
                            'MMMM YYYY',
                          )}
                    </h3>
                    <h1 className="text-white text-3xl font-semibold">
                      {data.readTrip.trip.name}
                    </h1>
                  </div>
                  <div className="w-full p-3 grid grid-cols-7 text-white text-center bg-myGreen-darkest bg-opacity-70">
                    <TripStatus trip={data.readTrip.trip} />
                  </div>
                </div>
              </div>
              <ul className="relative px-4 py-7 bg-myGray-lightest">
                <li className="pl-3 flex">
                  <div className="w-10 h-10 mr-3 flex items-center justify-center rounded-full border border-myGray text-myGray text-xl">
                    <FontAwesomeIcon icon={faHome} />
                  </div>
                  <div className="text-sm">
                    <span className="block text-myGray-darkest font-semibold">
                      Trip started
                    </span>
                    <span className="text-myGray-dark">
                      {startDateData &&
                        timeZoneData &&
                        moment(startDateData)
                          .tz(timeZoneData)
                          .format('D MMMM YYYY')}
                    </span>
                  </div>
                </li>
                {data?.readTrip.trip?.steps
                  .slice()
                  .sort(sortSteps)
                  .map((step) => {
                    return (
                      <React.Fragment key={step.id}>
                        <AddStepButton
                          isSelf={isSelf}
                          onClick={() => {
                            if (isSelf) {
                              setBelowStepDate(step.arrivedAt);
                              setBelowStepTimeZone(step.timeZone);
                              setIsSaveStepModal(true);
                            }
                          }}
                        />
                        <StepCard
                          step={step}
                          setEditingStep={setEditingStep}
                          setIsSaveStepModal={setIsSaveStepModal}
                        />
                      </React.Fragment>
                    );
                  })}
                <AddStepButton
                  isSelf={isSelf}
                  onClick={() => {
                    if (isSelf) {
                      setBelowStepDate(
                        data?.readTrip.trip?.endDate ?? moment().format(),
                      );
                      setIsSaveStepModal(true);
                    }
                  }}
                />
                <li className="pl-3 flex">
                  <div className="w-10 h-10 mr-3 flex items-center justify-center rounded-full border border-myGray text-myGray text-xl">
                    <FontAwesomeIcon icon={faHome} />
                  </div>
                  <div className="text-sm">
                    <span className="block text-myGray-darkest font-semibold">
                      Trip Finished
                    </span>
                    <span className="text-myGray-dark">
                      {endDateData &&
                        timeZoneData &&
                        moment(endDateData)
                          .tz(timeZoneData)
                          .format('D MMMM YYYY')}
                    </span>
                  </div>
                </li>
              </ul>
            </article>
          </section>
          <section className="relative z-0 w-1/2 h-screenExceptHeader">
            <Map isSaveStepModal={isSaveStepModal} />
          </section>
        </main>
      )}
    </FormProvider>
  );
};
