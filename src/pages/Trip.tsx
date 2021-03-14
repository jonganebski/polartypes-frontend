import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormProvider, useForm } from 'react-hook-form';
import { Redirect, useParams } from 'react-router-dom';
import { AddStepButton } from '../components/Button-add-step';
import { StepCard } from '../components/Cards/Step';
import { CommonHeader } from '../components/Headers/CommonHeader';
import { StepsHeader } from '../components/Headers/StepsHeader';
import { Loading } from '../components/Loading';
import { Map } from '../components/Map/Map';
import { SaveStepModal } from '../components/Modals/Save-step';
import { SaveTripModal } from '../components/Modals/Save-trip';
import { SigninModal } from '../components/Modals/Signin';
import { SignupModal } from '../components/Modals/Signup';
import { Options } from '../components/Options';
import { TimeStamp } from '../components/TimeStamp';
import { TripIntro } from '../components/Trip-intro';
import { useStepIdContext } from '../context';
import { sortSteps } from '../helpers';
import { useLazyTrip } from '../hooks/useQuery/useTrip';
import { useLazyTrips } from '../hooks/useQuery/useTrips';
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
  const ctx = useStepIdContext();
  const [isSignup, setIsSignup] = useState<boolean | null>(null);
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
  const f = useForm<ICreateStepFormProps>({
    mode: 'onChange',
    defaultValues: {},
  });
  const [
    lazyWhoAmIQuery,
    { data: userData, loading: isUserDataLoading },
  ] = useWhoAmI();
  const [
    lazyTripQuery,
    { data, called, loading: isTripLoading },
  ] = useLazyTrip();
  const [
    lazyTripsQuery,
    { data: tripsData, loading: isTripsLoading },
  ] = useLazyTrips();
  useEffect(() => {
    lazyWhoAmIQuery();
    lazyTripQuery({ variables: { input: { tripId: +tripId } } });
    lazyTripsQuery({ variables: { input: { targetUsername } } });
  }, [lazyTripQuery, lazyTripsQuery, lazyWhoAmIQuery, targetUsername, tripId]);

  const isSelf = data?.readTrip.trip?.traveler.slug === userData?.whoAmI.slug;
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
  const isLoading = isUserDataLoading || isTripLoading || isTripsLoading;

  if (isLoading) {
    <Loading />;
  }
  if (!isLoading && called && !data?.readTrip.trip) {
    return <Redirect to="/" />;
  }
  if (!data?.readTrip.trip) {
    return null;
  }
  return (
    <FormProvider {...f}>
      <Options
        userData={userData}
        isOption={isOption}
        setIsOption={setIsOption}
      />
      <Helmet>
        <title>{data.readTrip.trip.name} | Polartypes</title>
      </Helmet>
      <CommonHeader
        userData={userData}
        setIsSignup={setIsSignup}
        setIsOption={setIsOption}
      />
      {isSignup === false && <SigninModal setIsSignup={setIsSignup} />}
      {isSignup === true && <SignupModal setIsSignup={setIsSignup} />}
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
                setIsSaveStepModal={setIsSaveStepModal}
                editingStep={editingStep}
              />
            )}
            {isEditTripModal && userData && isSelf && (
              <SaveTripModal
                userData={userData}
                setIsCreateTrip={setIsEditTripModal}
                editingTrip={editingTrip}
                trips={tripsData?.readTrips.targetUser?.trips.filter(
                  (trip) => trip.id !== data.readTrip.trip?.id,
                )}
              />
            )}
            <StepsHeader
              currentUserSlug={userData?.whoAmI.slug}
              isSelf={isSelf}
              trip={data.readTrip.trip}
              setEditingTrip={setEditingTrip}
              setIsEditTripModal={setIsEditTripModal}
            />
            <article ref={articleRef} className="h-tripBody overflow-y-scroll">
              <TripIntro trip={data.readTrip.trip} />
              <ul className="relative px-4 py-7 bg-myGray-lightest">
                {startDateData && timeZoneData && (
                  <TimeStamp
                    text="Trip started"
                    dateString={startDateData}
                    timeZone={timeZoneData}
                  />
                )}
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
                {timeZoneData &&
                  (endDateData ? (
                    <TimeStamp
                      text="Trip Finished"
                      dateString={endDateData}
                      timeZone={timeZoneData}
                    />
                  ) : (
                    <TimeStamp
                      text="Now traveling"
                      dateString={endDateData}
                      timeZone={timeZoneData}
                    />
                  ))}
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
