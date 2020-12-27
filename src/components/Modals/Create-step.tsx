import {
  faCalendar,
  faClock,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { INITIAL_DATE_STATE } from '../../constants';
import { deleteFiles, getTimeZone } from '../../helpers';
import { useCreateStep } from '../../hooks/useCreateStep';
import { useDeleteStep } from '../../hooks/useDeleteStep';
import { useGeocoder } from '../../hooks/useGeocoder';
import { useUpdateStep } from '../../hooks/useUpdateStep';
import { readTripQuery_readTrip_trip_steps } from '../../__generated__/readTripQuery';
import { Button } from '../Button';
import { Calendar } from '../Tooltips/Calendar';
import { Clock } from '../Tooltips/Clock';
import { NewCalendar } from '../Tooltips/NewCalendar';
import { ModalCloseIcon } from './partials/CloseIcon';
import { FilesArea } from './partials/FilesArea';

interface ICreateStepModalProps {
  tripId: string;
  tripStartDate: string;
  tripEndDate: string | null;
  belowStepDate: string;
  belowStepTimeZone: string;
  setIsCreateStepModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingStep: readTripQuery_readTrip_trip_steps | null;
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
  id?: string;
  src?: string;
  url?: string;
  __typename: 'Image';
}

export const CreateStepModal: React.FC<ICreateStepModalProps> = ({
  tripId,
  tripStartDate,
  tripEndDate,
  belowStepDate,
  belowStepTimeZone,
  setIsCreateStepModal,
  editingStep,
}) => {
  const belowDateObj = new Date(belowStepDate);
  const [arrivedDateState, setArrivedDate] = useState<Date | null>(
    belowDateObj,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLocationBlock, setIsLocationBlock] = useState(false);
  const [images, setImages] = useState<IImagesState[]>(
    editingStep?.images ?? [],
  );
  const [uploadErr, setUploadErr] = useState('');
  const [isPopupCalendar, setIsPopupCalendar] = useState<boolean | null>(null);
  const f = useForm<ICreateStepFormProps>({
    mode: 'onChange',
    defaultValues: {
      arrivedAt: editingStep?.arrivedAt ?? belowStepDate,
      country: editingStep?.country,
      lat: editingStep?.lat.toString(),
      lon: editingStep?.lon.toString(),
      location: editingStep?.location,
      name: editingStep?.name,
      story: editingStep?.story ?? '',
      timeZone: editingStep?.timeZone,
    },
  });
  const [
    createStepMutation,
    { loading: createStepMutationLoading },
  ] = useCreateStep(f, tripId, images, setIsCreateStepModal);

  const [
    updateStepMutation,
    { loading: updateStepMutaionLoading },
  ] = useUpdateStep(f, tripId, images, editingStep, setIsCreateStepModal);

  const [
    deleteStepMutation,
    { loading: deleteStepMutaionLoading },
  ] = useDeleteStep(tripId, images, setIsCreateStepModal);

  const { geocodeData, setGeocodeData } = useGeocoder(searchTerm);

  const onLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
  };

  const onSubmit = () => {
    const { lat, lon } = f.getValues();
    if (editingStep) {
      updateStepMutation({
        variables: {
          input: {
            ...f.getValues(),
            stepId: editingStep.id,
            lat: +lat,
            lon: +lon,
          },
        },
      });
    } else {
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
    }
  };

  const cleanupUnusedImages = useCallback(() => {
    if (images.length === 0 || !images.some((image) => image.url)) {
      return;
    }
    const urls: string[] = [];
    if (editingStep) {
      images.forEach((image) => {
        if (!image.url) {
          return;
        }
        const isUsedImage = editingStep.images.some(
          (img) => img.url === image.url,
        );
        console.log(image, isUsedImage);
        if (!isUsedImage) {
          urls.push(image.url);
        }
      });
    } else {
      images.forEach((image) => image.url && urls.push(image.url));
    }
    console.log('foo: ', urls);
    urls.length !== 0 && deleteFiles(urls);
  }, [editingStep, images]);

  const onModalClose = useCallback(() => {
    if (isUploading) {
      return;
    }
    cleanupUnusedImages();
    setIsCreateStepModal(false);
  }, [cleanupUnusedImages, isUploading, setIsCreateStepModal]);

  useEffect(() => {
    window.addEventListener('beforeunload', cleanupUnusedImages);
  }, [cleanupUnusedImages]);

  return (
    <FormProvider {...f}>
      <div className="absolute z-50 top-0 left-0 w-full h-full bg-myGreen-darkest bg-opacity-80"></div>
      <div className="absolute z-50 top-0 left-0 w-full h-screenExceptHeader overflow-y-scroll">
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-11/12 bg-white rounded-2xl">
          <ModalCloseIcon onClick={onModalClose} />
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
                      {f.getValues().arrivedAt && f.getValues().timeZone
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
                  {isPopupCalendar && f.getValues('timeZone') && (
                    <NewCalendar
                      name="arrivedAt"
                      timeZone={f.getValues('timeZone')}
                      selectedDate={moment.tz(
                        f.getValues('arrivedAt'),
                        f.getValues('timeZone'),
                      )}
                      effectiveSince={tripStartDate}
                      effectiveUntil={moment(tripEndDate)
                        .add(1, 'days')
                        .format()}
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
                      {f.getValues().arrivedAt && f.getValues().timeZone
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
                editingStep={editingStep}
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
            <div className="flex justify-between">
              <div>
                <Button
                  text={editingStep ? 'Save changes' : 'Add step'}
                  type="red-solid"
                  loading={
                    createStepMutationLoading || updateStepMutaionLoading
                  }
                  disabled={
                    !f.formState.isValid ||
                    isUploading ||
                    createStepMutationLoading ||
                    updateStepMutaionLoading
                  }
                  className="mr-4"
                />
                <Button
                  text="Cancel"
                  type="white-solid"
                  isSubmitBtn={false}
                  disabled={
                    isUploading ||
                    createStepMutationLoading ||
                    updateStepMutaionLoading
                  }
                  onClick={onModalClose}
                />
              </div>
              {editingStep && (
                <Button
                  text=""
                  type="white-solid"
                  icon={
                    <FontAwesomeIcon icon={faTrashAlt} className="text-lg" />
                  }
                  fontColorClass="text-myRed"
                  isSubmitBtn={false}
                  disabled={isUploading || updateStepMutaionLoading}
                  onClick={() => {
                    const isConfirmed = window.confirm(
                      'You are deleting this step permanently. Are you sure?',
                    );
                    isConfirmed &&
                      deleteStepMutation({
                        variables: { input: { stepId: editingStep.id } },
                      });
                  }}
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};
