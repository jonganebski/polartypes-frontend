import { gql, useQuery } from '@apollo/client';
import {
  faCalendar,
  faEye,
  faHeart,
} from '@fortawesome/free-regular-svg-icons';
import {
  faAtlas,
  faBook,
  faCamera,
  faCog,
  faHome,
  faPassport,
  faShareAlt,
  faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { AddStepButton } from '../components/Button-add-step';
import { StepCard } from '../components/Cards/Step';
import { CommonHeader } from '../components/Headers/CommonHeader';
import { SaveStepModal } from '../components/Modals/Save-step';
import { useWhoAmI } from '../hooks/useWhoAmI';
import {
  readTripQuery,
  readTripQueryVariables,
  readTripQuery_readTrip_trip_steps,
} from '../__generated__/readTripQuery';

export const READ_TRIP_QUERY = gql`
  query readTripQuery($input: ReadTripInput!) {
    readTrip(input: $input) {
      ok
      error
      trip {
        startDate
        endDate
        traveler {
          id
          username
          firstName
          lastName
          avatarUrl
          timeZone
        }
        steps {
          id
          name
          location
          country
          arrivedAt
          timeZone
          lat
          lon
          story
          imgUrls
          traveler {
            id
          }
          likes {
            user {
              username
              avatarUrl
            }
          }
          comments {
            id
            createdAt
            text
            creator {
              id
              username
              avatarUrl
            }
          }
        }
      }
    }
  }
`;

interface IParams {
  tripId: string;
}

export const Trip = () => {
  const { tripId } = useParams<IParams>();
  const { data: userData } = useWhoAmI();
  const [isSaveStepModal, setIsSaveStepModal] = useState(false);
  const [
    editingStep,
    setEditingStep,
  ] = useState<readTripQuery_readTrip_trip_steps | null>(null);
  const [belowStepDate, setBelowStepDate] = useState<string>('');
  const [belowStepTimeZone, setBelowStepTimeZone] = useState('');
  const { data } = useQuery<readTripQuery, readTripQueryVariables>(
    READ_TRIP_QUERY,
    {
      variables: { input: { tripId: +tripId } },
    },
  );
  const isSelf = data?.readTrip.trip?.traveler.id === userData?.whoAmI.id;
  const startDateData = data?.readTrip.trip?.startDate;
  const endDateData = data?.readTrip.trip?.endDate;
  const timeZoneData = data?.readTrip.trip?.traveler.timeZone;
  useEffect(() => {
    if (!isSaveStepModal) {
      setEditingStep(null);
    }
  }, [isSaveStepModal]);
  if (!data?.readTrip.trip) {
    return null;
  }
  return (
    <div>
      <CommonHeader />
      <div className="h-screenExceptHeader flex">
        <section className="relative w-1/2 h-full min-w-px600">
          {isSaveStepModal && (
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
              {isSelf && (
                <Button
                  text="Trip settings"
                  type="white-solid"
                  size="sm"
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
          <article className="h-tripBody overflow-y-scroll">
            <div
              style={{
                backgroundImage:
                  'url("../andreas-gucklhorn-mawU2PoJWfU-unsplash.jpg")',
              }}
              className="relative h-96 bg-cover bg-center"
            >
              <div className="absolute w-full h-full flex flex-col items-center justify-between bg-black bg-opacity-50">
                <div className="h-full flex flex-col items-center justify-center">
                  <h3 className="mb-1 text-white text-sm font-semibold">
                    April 2020 - December 2020
                  </h3>
                  <h1 className="text-white text-3xl font-semibold">
                    Trip name
                  </h1>
                </div>
                <div className="w-full p-3 grid grid-cols-7 text-white text-center bg-myGreen-darkest bg-opacity-70">
                  <div>
                    <FontAwesomeIcon
                      icon={faTachometerAlt}
                      className="text-xl"
                    />
                    <span className="block mt-1.5 -mb-1.5 font-semibold">
                      3,799
                    </span>
                    <span className="text-xs">kilometers</span>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faEye} className="text-xl" />
                    <span className="block mt-1.5 -mb-1.5 font-semibold">
                      3,799
                    </span>
                    <span className="text-xs">views</span>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faHeart} className="text-xl" />
                    <span className="block mt-1.5 -mb-1.5 font-semibold">
                      10
                    </span>
                    <span className="text-xs">likes</span>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faCalendar} className="text-xl" />
                    <span className="block mt-1.5 -mb-1.5 font-semibold">
                      200
                    </span>
                    <span className="text-xs">days</span>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faCamera} className="text-xl" />
                    <span className="block mt-1.5 -mb-1.5 font-semibold">
                      {data?.readTrip.trip?.steps.reduce((acc, v) => {
                        if (v.imgUrls) {
                          return acc + v.imgUrls?.length;
                        } else {
                          return acc;
                        }
                      }, 0)}
                    </span>
                    <span className="text-xs">photos</span>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faPassport} className="text-xl" />
                    <span className="block mt-1.5 -mb-1.5 font-semibold">
                      12
                    </span>
                    <span className="text-xs">countries</span>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faAtlas} className="text-xl" />
                    <span className="block mt-1.5 -mb-1.5 font-semibold">
                      {data?.readTrip.trip?.steps.length}
                    </span>
                    <span className="text-xs">
                      {data?.readTrip.trip?.steps.length === 1
                        ? 'step'
                        : 'steps'}
                    </span>
                  </div>
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
                        .format('d MMMM YYYY')}
                  </span>
                </div>
              </li>
              {data?.readTrip.trip?.steps
                .slice()
                .sort((a, b) => {
                  return (
                    new Date(a.arrivedAt).getTime() -
                    new Date(b.arrivedAt).getTime()
                  );
                })
                .map((step) => {
                  return (
                    <React.Fragment key={step.id}>
                      <AddStepButton
                        isSelf={isSelf}
                        onClick={() => {
                          setBelowStepDate(step.arrivedAt);
                          setBelowStepTimeZone(step.timeZone);
                          setIsSaveStepModal(true);
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
                  console.log(
                    data?.readTrip.trip?.endDate,
                    moment(new Date()).format(),
                  );
                  setBelowStepDate(
                    data?.readTrip.trip?.endDate ?? moment(new Date()).format(),
                  );
                  setIsSaveStepModal(true);
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
                        .format('d MMMM YYYY')}
                  </span>
                </div>
              </li>
            </ul>
          </article>
        </section>
        <section className="w-1/2 h-tripBody bg-green-700"></section>
      </div>
    </div>
  );
};
