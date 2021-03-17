import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { AddStepButton } from '../components/Button-add-step';
import { StepCard } from '../components/Cards/Step';
import { StepsHeader } from '../components/Headers/StepsHeader';
import { Layout } from '../components/Layout';
import { Loading } from '../components/Loading';
import { Map } from '../components/Map/Map';
import { SaveStepModal } from '../components/Modals/Save-step';
import { SaveTripModal } from '../components/Modals/Save-trip';
import { NotFound } from '../components/NotFound404';
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
  const [isSaveTripModal, setIsSaveTripModal] = useState(false);
  const [isSaveStepModal, setIsSaveStepModal] = useState(false);
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
  const { data: userData, loading: isUserDataLoading } = useWhoAmI();
  const [
    lazyTripQuery,
    { data, called, loading: isTripLoading },
  ] = useLazyTrip();
  const [
    lazyTripsQuery,
    { data: tripsData, loading: isTripsLoading },
  ] = useLazyTrips();

  useEffect(() => {
    lazyTripQuery({ variables: { input: { tripId: +tripId } } });
    lazyTripsQuery({
      variables: { input: { slug: targetUsername.toLowerCase() } },
    });
    // eslint-disable-next-line
  }, [targetUsername, tripId]);

  const startDateData = data?.readTrip.trip?.startDate;
  const endDateData = data?.readTrip.trip?.endDate;
  const timeZoneData = data?.readTrip.trip?.traveler.timeZone;
  const isMe = data?.readTrip.trip?.traveler.isMe ?? false;

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

  if (isLoading || !called) {
    return <Loading />;
  }
  if (!data?.readTrip.trip) {
    return <NotFound />;
  }
  return (
    <FormProvider {...f}>
      <Layout className="flex" title={data.readTrip.trip.name}>
        <section className="relative w-1/2 h-full min-w-px600">
          {isSaveStepModal && data.readTrip.trip.traveler.isMe && (
            <SaveStepModal
              tripId={tripId}
              tripStartDate={data.readTrip.trip.startDate}
              tripEndDate={data.readTrip.trip.endDate}
              belowStepDate={belowStepDate}
              setIsSaveStepModal={setIsSaveStepModal}
              editingStep={editingStep}
            />
          )}
          {isSaveTripModal && userData && isMe && (
            <SaveTripModal
              userData={userData}
              setIsSaveTripModal={setIsSaveTripModal}
              editingTrip={editingTrip}
              trips={tripsData?.readTrips.targetUser?.trips.filter(
                (trip) => trip.id !== data.readTrip.trip?.id,
              )}
            />
          )}
          <StepsHeader
            isMe={isMe}
            trip={data.readTrip.trip}
            setEditingTrip={setEditingTrip}
            setIsSaveTripModal={setIsSaveTripModal}
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
                        isMe={isMe}
                        onClick={() => {
                          if (isMe) {
                            setBelowStepDate(step.arrivedAt);
                            setIsSaveStepModal(true);
                          }
                        }}
                      />
                      <StepCard
                        isMe={data.readTrip.trip?.traveler.isMe ?? false}
                        step={step}
                        setEditingStep={setEditingStep}
                        setIsSaveStepModal={setIsSaveStepModal}
                      />
                    </React.Fragment>
                  );
                })}
              <AddStepButton
                isMe={isMe}
                onClick={() => {
                  if (isMe) {
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
      </Layout>
    </FormProvider>
  );
};
