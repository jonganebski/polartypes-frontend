import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { INITIAL_DATE_STATE } from '../../constants';
import { deleteFiles, getTimeZone } from '../../helpers';
import { useGeocoder } from '../../hooks/useGeocoder';
import { Button } from '../Button';
import { ModalCloseIcon } from './partials/CloseIcon';
import { Calendar } from '../Tooltips/Calendar';
import { Clock } from '../Tooltips/Clock';
import { FilesArea } from './partials/FilesArea';
import { gql, useMutation } from '@apollo/client';
import {
  createStepMutation,
  createStepMutationVariables,
} from '../../__generated__/createStepMutation';
import {
  createImageMutation,
  createImageMutationVariables,
} from '../../__generated__/createImageMutation';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { client } from '../../apollo';
import { READ_TRIP_QUERY } from '../../pages/Trip';
import {
  readTripQuery,
  readTripQueryVariables,
  readTripQuery_readTrip_trip_steps_images,
} from '../../__generated__/readTripQuery';

const CREATE_STEP_MUTAION = gql`
  mutation createStepMutation($input: CreateStepInput!) {
    createStep(input: $input) {
      ok
      error
      createdStepId
    }
  }
`;

const CREATE_IMAGE_MUTATION = gql`
  mutation createImageMutation($input: CreateImageInput!) {
    createImage(input: $input) {
      ok
      error
      stepId
    }
  }
`;

interface ICreateStepModal {
  tripId: string;
  tripStartDate: string;
  tripEndDate: string | null;
  belowStepDate: string | null;
  belowStepTimeZone: string;
  setIsCreateStepModal: React.Dispatch<React.SetStateAction<boolean>>;
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

export interface IImagesState {
  id: string;
  src: string;
  url?: string;
}

export const CreateStepModal: React.FC<ICreateStepModal> = ({
  tripId,
  tripStartDate,
  tripEndDate,
  belowStepDate,
  belowStepTimeZone,
  setIsCreateStepModal,
}) => {
  const belowDateObj = belowStepDate ? new Date(belowStepDate) : new Date();
  const belowLocalDate = moment(belowStepDate).tz(belowStepTimeZone).format();
  const [arrivedDateState, setArrivedDate] = useState<Date | null>(
    belowDateObj,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLocationBlock, setIsLocationBlock] = useState(false);
  const [images, setImages] = useState<IImagesState[]>([]);
  const [uploadErr, setUploadErr] = useState('');
  const [isPopupCalendar, setIsPopupCalendar] = useState<boolean | null>(null);
  const f = useForm<ICreateStepFormProps>({
    mode: 'onChange',
    defaultValues: {
      arrivedAt: belowLocalDate,
    },
  });
  const updateApolloCache = (
    stepId: number,
    imagesState: IImagesState[] = [],
  ) => {
    const { lat, lon } = f.getValues();
    const images: readTripQuery_readTrip_trip_steps_images[] = [];
    imagesState.forEach(
      (state) =>
        state.url && images.push({ __typename: 'Image', url: state.url }),
    );
    const prevQuery = client.readQuery<readTripQuery, readTripQueryVariables>({
      query: READ_TRIP_QUERY,
      variables: { input: { tripId: +tripId } },
    });
    prevQuery &&
      client.writeQuery<readTripQuery, readTripQueryVariables>({
        query: READ_TRIP_QUERY,
        variables: { input: { tripId: +tripId } },
        data: {
          readTrip: {
            ...prevQuery.readTrip,
            trip: {
              ...prevQuery.readTrip.trip!,
              steps: [
                {
                  ...f.getValues(),
                  __typename: 'Step',
                  id: stepId,
                  lat: +lat,
                  lon: +lon,
                  likes: [],
                  comments: [],
                  images,
                },
                ...prevQuery.readTrip.trip!.steps,
              ],
            },
          },
        },
      });
  };

  const [
    createImageMutation,
    { loading: createImageMutationLoading },
  ] = useMutation<createImageMutation, createImageMutationVariables>(
    CREATE_IMAGE_MUTATION,
  );

  const onCreateStepCompleted = async (data: createStepMutation) => {
    const {
      createStep: { ok, error, createdStepId },
    } = data;
    // const urls = f.getValues().imageUrls;
    if (ok && !error && createdStepId) {
      if (images.length !== 0 && images.some((image) => image.url)) {
        const urls: string[] = [];
        images.forEach((image) => image.url && urls.push(image.url));
        const { data, errors } = await createImageMutation({
          variables: {
            input: { stepId: createdStepId, urls },
          },
        });
        if (data && !errors) {
          const {
            createImage: { ok, error, stepId },
          } = data;
          if (ok && !error && stepId) {
            updateApolloCache(stepId, images);
            setIsCreateStepModal(false);
          }
        }
      } else {
        updateApolloCache(createdStepId);
        setIsCreateStepModal(false);
      }
    }
  };

  const [
    createStepMutation,
    { loading: createStepMutationLoading },
  ] = useMutation<createStepMutation, createStepMutationVariables>(
    CREATE_STEP_MUTAION,
    { onCompleted: onCreateStepCompleted },
  );
  const { geocodeData, setGeocodeData } = useGeocoder(searchTerm);

  const onLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
  };

  const onSubmit = () => {
    const { lat, lon } = f.getValues();
    createStepMutation({
      variables: {
        input: {
          ...f.getValues(),
          lat: +lat,
          lon: +lon,
          tripId: +tripId,
        },
      },
    });
  };
  useEffect(() => {
    return () => {
      window.addEventListener('beforeunload', () => {
        const urls: string[] = [];
        images.forEach((image) => image.url && urls.push(image.url));
        urls && deleteFiles(urls);
      });
    };
  }, [images]);
  return (
    <FormProvider {...f}>
      <div className="absolute z-50 top-0 left-0 w-full h-full bg-myGreen-darkest bg-opacity-80"></div>
      <div className="absolute z-50 top-0 left-0 w-full h-screenExceptHeader overflow-y-scroll">
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-11/12 bg-white rounded-2xl">
          <ModalCloseIcon
            onClick={() => {
              if (!isUploading) {
                setIsCreateStepModal(false);
                const urls: string[] = [];
                images.forEach((image) => image.url && urls.push(image.url));
                urls && deleteFiles(urls);
              }
            }}
          />
          <div className="py-6 text-center text-2xl text-myGreen-darkest font-semibold border-b">
            New Trip
          </div>
          <form onSubmit={f.handleSubmit(onSubmit)} className="p-6">
            <section className="relative p-6 mb-4 grid grid-cols-oneToTwo bg-myGray-dark rounded-2xl">
              <h3 className="text-white font-semibold">Location</h3>
              <div className="rounded-sm">
                <div className="relative">
                  <input
                    onChange={onLocationChange}
                    ref={f.register({ required: true })}
                    name="location"
                    placeholder="Enter a location"
                    autoComplete="off"
                    className="input w-full border-transparent rounded-b-none"
                  />
                  <div className="absolute z-10 w-full flex flex-col bg-white">
                    {geocodeData?.map((d: any, i: number) => {
                      return (
                        <div
                          key={i}
                          onClick={async () => {
                            const lat = (+d.point?.lat)?.toFixed(6);
                            const lon = (+d.point?.lng)?.toFixed(6);
                            f.setValue('location', d.name, {
                              shouldValidate: true,
                            });
                            f.setValue('lat', lat, { shouldValidate: true });
                            f.setValue('lon', lon, { shouldValidate: true });
                            f.setValue('country', d.country, {
                              shouldValidate: true,
                            });
                            setGeocodeData(null);
                          }}
                          className="px-4 py-2 cursor-pointer text-sm hover:bg-myGray-lightest"
                        >
                          <span className="mr-2">{d.name}</span>
                          <span className="text-myGray">{d.country}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-2 pl-4 flex bg-white text-myGray-darkest text-sm">
                  <div className="flex items-center border-r border-myGray-light">
                    <span className="font-semibold">Lat:</span>
                    <input
                      ref={f.register({ required: true })}
                      name="lat"
                      placeholder="00,000000"
                      className="ml-1 w-full focus:outline-none"
                    />
                  </div>
                  <div className="pl-4 flex items-center">
                    <span className="font-semibold">Lon:</span>
                    <input
                      ref={f.register({ required: true })}
                      name="lon"
                      placeholder="00,000000"
                      className="ml-1 w-full focus:outline-none"
                    />
                  </div>
                  <div
                    onClick={async () => {
                      const { location, lat, lon } = f.getValues();
                      if (location && lat && lon) {
                        const { ok, error, timeZone } = await getTimeZone(
                          lat,
                          lon,
                        );
                        if (ok && !error && timeZone) {
                          f.setValue('timeZone', timeZone);
                        }
                        setIsLocationBlock(true);
                      }
                    }}
                    className="py-1.5 px-4 rounded-full bg-myBlue text-white cursor-pointer"
                  >
                    Set
                  </div>
                </div>
              </div>
              {isLocationBlock && (
                <div
                  onClick={() => {
                    setIsLocationBlock((prev) => !prev);
                  }}
                  className="absolute top-0 left-0 w-full h-full p-3 rounded-2xl text-sm bg-white bg-opacity-80 cursor-pointer group hover:bg-myBlue hover:bg-opacity-80"
                >
                  <div className="text-transparent group-hover:text-white">
                    <FontAwesomeIcon icon={faPencilAlt} className="mr-2" />
                    <span>Edit info</span>
                  </div>
                </div>
              )}
            </section>
            <section className="relative p-6 mb-6 grid grid-cols-oneToTwo gap-y-4 rounded-2xl shadow-surround">
              <h3 className="flex items-center text-myGreen-darkest font-semibold">
                Step name
              </h3>
              <div className="flex">
                <input
                  ref={f.register({ required: true })}
                  name="name"
                  placeholder="-"
                  className="input w-full rounded-r-none"
                />
                <input
                  ref={f.register({ required: true })}
                  name="country"
                  readOnly
                  style={{
                    width: f.watch('country')?.length + 2 + 'ch',
                  }}
                  className="px-2 py-3 w-0 text-myGray-dark border border-l-0 border-myGray bg-myGray-light rounded-r-md rounded-l-none focus:outline-none"
                />
              </div>
              <h3 className="flex items-center text-myGreen-darkest font-semibold">
                Arrival Date & Time
              </h3>
              <div className="flex">
                <input
                  ref={f.register({ required: true })}
                  name="arrivedAt"
                  className="hidden"
                  readOnly
                />
                <div
                  className={`relative mr-3 w-full border border-solid rounded-sm cursor-pointer focus:outline-none ${
                    isPopupCalendar ? 'border-myBlue' : 'border-myGray'
                  }`}
                >
                  <div
                    className="px-4 py-3 flex items-center justify-between"
                    onClick={() =>
                      setIsPopupCalendar((prev) => (prev ? null : true))
                    }
                  >
                    <span>
                      {f.getValues().timeZone
                        ? moment
                            .tz(f.watch('arrivedAt'), f.watch('timeZone'))
                            .format('MMM D YYYY')
                        : ''}
                    </span>
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="text-myBlue text-xl"
                    />
                  </div>
                  {isPopupCalendar && (
                    <Calendar
                      selectedDate={arrivedDateState}
                      initialDateState={INITIAL_DATE_STATE}
                      setSelectedDate={setArrivedDate}
                      effectiveSince={
                        new Date(
                          new Date(tripStartDate).getFullYear(),
                          new Date(tripStartDate).getMonth(),
                          new Date(tripStartDate).getDate() - 1,
                        )
                      }
                      effectiveUntil={
                        tripEndDate ? new Date(tripEndDate) : null
                      }
                    />
                  )}
                </div>
                <div
                  className={`relative px-4 py-3 border border-solid rounded-sm cursor-pointer ${
                    isPopupCalendar === false
                      ? 'border-myBlue'
                      : 'border-myGray'
                  }`}
                >
                  <div
                    onClick={() =>
                      setIsPopupCalendar((prev) =>
                        prev === false ? null : false,
                      )
                    }
                    className="mr-3 w-full flex items-center justify-between whitespace-nowrap"
                  >
                    <span>
                      {f.getValues().timeZone
                        ? moment
                            .tz(f.watch('arrivedAt'), f.watch('timeZone'))
                            .format('HH : mm')
                        : ''}
                    </span>
                    <FontAwesomeIcon
                      icon={faClock}
                      className="text-myBlue text-xl"
                    />
                  </div>
                  {isPopupCalendar === false && (
                    <Clock timeZone={f.watch('timeZone')} />
                  )}
                  <input
                    ref={f.register()}
                    name="timeZone"
                    readOnly
                    className="hidden"
                  />
                </div>
              </div>
              <h3 className="mt-3 text-myGreen-darkest font-semibold">
                Your story
              </h3>
              <textarea
                ref={f.register()}
                name="story"
                placeholder="What have you been up to?"
                className="resize-none px-4 py-3 h-48 border border-myGray rounded-sm focus:outline-none focus:border-myBlue"
              />
              <h3 className="flex flex-col justify-center text-myGreen-darkest font-semibold">
                Add your photos
                <span className="text-sm font-medium text-myGray-dark">
                  Drag'n drop to re-arrange
                </span>
              </h3>
              <FilesArea
                images={images}
                setImages={setImages}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                uploadErr={uploadErr}
                setUploadErr={setUploadErr}
              />
              {!isLocationBlock && (
                <div
                  onClick={() => {
                    const {
                      location,
                      lat,
                      lon,
                      country,
                      timeZone,
                    } = f.getValues();
                    if (location && lat && lon && country && timeZone) {
                      setIsLocationBlock((prev) => !prev);
                    }
                  }}
                  className="absolute top-0 left-0 w-full h-full p-3 rounded-2xl text-sm bg-white bg-opacity-80 cursor-pointer group hover:bg-myBlue hover:bg-opacity-80"
                >
                  <div className="text-transparent group-hover:text-white">
                    <FontAwesomeIcon icon={faPencilAlt} className="mr-2" />
                    <span>Edit info</span>
                  </div>
                </div>
              )}
            </section>
            <div>
              <Button
                text="Add step"
                type="red-solid"
                loading={
                  createStepMutationLoading || createImageMutationLoading
                }
                disabled={!f.formState.isValid || isUploading}
                className="mr-4"
              />
              <Button
                text="Cancel"
                type="white-solid"
                isSubmitBtn={false}
                disabled={isUploading}
                onClick={() => {
                  setIsCreateStepModal(false);
                  const urls: string[] = [];
                  images.forEach((image) => image.url && urls.push(image.url));
                  urls && deleteFiles(urls);
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};
