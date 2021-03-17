import {
  faCalendar,
  faClock,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { deleteFiles, getTimeZone } from '../../helpers';
import { useCreateStep } from '../../hooks/useMutation/useCreateStep';
import { useDeleteStep } from '../../hooks/useMutation/useDeleteStep';
import { useGeocoder } from '../../hooks/useGeocoder';
import { useUpdateStep } from '../../hooks/useMutation/useUpdateStep';
import { readTripQuery_readTrip_trip_steps } from '../../__generated__/readTripQuery';
import { Button } from '../Button';
import { Clock } from '../Tooltips/Clock';
import { NewCalendar } from '../Tooltips/Calendar';
import { ModalCloseIcon } from './partials/CloseIcon';
import { FilesArea } from './partials/FilesArea';
import { ICreateStepFormProps } from '../../pages/Trip';
import { FormError } from '../Form-error';
import { Spinner } from '../Loading-spinner';

interface ISaveStepModalProps {
  tripId: string;
  tripStartDate: string;
  tripEndDate: string | null;
  belowStepDate: string;
  setIsSaveStepModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingStep: readTripQuery_readTrip_trip_steps | null;
}

export type TImage = { id?: string; src?: string; url?: string };

export const SaveStepModal: React.FC<ISaveStepModalProps> = ({
  tripId,
  tripStartDate,
  tripEndDate,
  belowStepDate,
  setIsSaveStepModal,
  editingStep,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isLocationBlock, setIsLocationBlock] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const [isPopupCalendar, setIsPopupCalendar] = useState<boolean | null>(null);
  const [images, setImages] = useState<TImage[]>(
    editingStep?.imgUrls?.map((url) => ({ url })) ?? [],
  );
  const [imagesRecord, setImagesRecord] = useState<TImage[]>(images);
  const f = useFormContext<ICreateStepFormProps>();
  const { setValue, getValues, handleSubmit, register, watch, formState } = f;
  const [
    createStepMutation,
    { loading: createStepMutationLoading },
  ] = useCreateStep(f, tripId, images, setIsSaveStepModal);

  const [
    updateStepMutation,
    { loading: updateStepMutaionLoading },
  ] = useUpdateStep(f, editingStep, images, setIsSaveStepModal);

  const [deleteStepMutation] = useDeleteStep(images, setIsSaveStepModal);

  const {
    onLocationInputChange,
    isGeocodeLoading,
    setGeocodeData,
    isGeocodeErr,
    geocodeData,
  } = useGeocoder();

  const cleanupUnusedImageFilesOnCancel = useCallback(() => {
    if (imagesRecord.length === 0 || !imagesRecord.some((image) => image.url)) {
      return;
    }
    const urls: string[] = [];
    if (editingStep) {
      imagesRecord.forEach((image) => {
        if (!image.url) {
          return;
        }
        const isUsedImage = editingStep.imgUrls?.some(
          (url) => url === image.url,
        );
        if (!isUsedImage) {
          urls.push(image.url);
        }
      });
    } else {
      imagesRecord.forEach((image) => image.url && urls.push(image.url));
    }
    urls.length !== 0 && deleteFiles(urls);
  }, [editingStep, imagesRecord]);

  const cleanupUnusedImageFilesOnEditSubmit = () => {
    if (imagesRecord.length === 0 || !imagesRecord.some((image) => image.url)) {
      return;
    }
    const urls: string[] = [];
    imagesRecord.forEach((image) => {
      if (!image.url) {
        return;
      }
      const isUsedImage = images.some((img) => img.url === image.url);
      if (!isUsedImage) {
        urls.push(image.url);
      }
    });
    urls.length !== 0 && deleteFiles(urls);
  };

  const onSubmit = () => {
    const { lat, lon, ...values } = getValues();
    const imgUrls = images.reduce((acc, img) => {
      if (img.url) {
        return [...acc, img.url];
      } else {
        return acc;
      }
    }, [] as string[]);
    if (editingStep) {
      cleanupUnusedImageFilesOnEditSubmit();
      updateStepMutation({
        variables: {
          input: {
            ...values,
            stepId: editingStep.id,
            lat: +lat,
            lon: +lon,
            imgUrls,
          },
        },
      });
    } else {
      createStepMutation({
        variables: {
          input: {
            ...values,
            tripId: +tripId,
            lat: +lat,
            lon: +lon,
            imgUrls,
          },
        },
      });
    }
  };

  const onModalClose = useCallback(() => {
    if (isUploading) {
      return;
    }
    cleanupUnusedImageFilesOnCancel();
    setIsSaveStepModal(false);
  }, [cleanupUnusedImageFilesOnCancel, isUploading, setIsSaveStepModal]);

  useEffect(() => {
    window.addEventListener('beforeunload', cleanupUnusedImageFilesOnCancel);
    return () =>
      window.removeEventListener(
        'beforeunload',
        cleanupUnusedImageFilesOnCancel,
      );
  }, [cleanupUnusedImageFilesOnCancel]);

  useEffect(() => {
    if (editingStep) {
      setValue('arrivedAt', editingStep.arrivedAt, { shouldValidate: true });
      setValue('country', editingStep.country, { shouldValidate: true });
      setValue('lat', editingStep.lat.toString(), { shouldValidate: true });
      setValue('lon', editingStep.lon.toString(), { shouldValidate: true });
      setValue('location', editingStep.location, { shouldValidate: true });
      setValue('name', editingStep.name, { shouldValidate: true });
      setValue('story', editingStep.story ?? '', { shouldValidate: true });
      setValue('timeZone', editingStep.timeZone, { shouldValidate: true });
    } else {
      setValue('arrivedAt', belowStepDate, { shouldValidate: true });
    }
  }, [belowStepDate, editingStep, setValue]);
  return (
    <>
      <div className="absolute z-50 top-0 left-0 w-full h-full bg-myGreen-darkest bg-opacity-80"></div>
      <div className="absolute z-50 top-0 left-0 w-full h-screenExceptHeader overflow-y-scroll">
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-11/12 bg-white rounded-2xl">
          <ModalCloseIcon onClick={onModalClose} />
          <div className="py-6 text-center text-2xl text-myGreen-darkest font-semibold border-b">
            {editingStep ? 'Edit step' : 'New Trip'}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <section className="relative p-6 mb-4 grid grid-cols-oneToTwo bg-myGray-dark rounded-2xl">
              <div>
                <h3 className="text-white font-semibold">Location</h3>
                <span className="block text-sm font-medium text-myGray-light">
                  Search
                </span>
                <span className="text-sm font-medium text-myGray-light">
                  or click the map
                </span>
              </div>
              <div className="rounded-sm">
                <div className="relative">
                  <input
                    onChange={onLocationInputChange}
                    ref={register({ required: true })}
                    name="location"
                    placeholder="Enter a location"
                    autoComplete="off"
                    className="input w-full border-transparent rounded-b-none"
                  />
                  {isGeocodeLoading && (
                    <div className="absolute right-5 top-6">
                      <Spinner color="my-green-dark" />
                    </div>
                  )}
                  <div className="absolute z-10 w-full flex flex-col bg-white">
                    {geocodeData?.map((d: any, i: number) => {
                      return (
                        <div
                          key={i}
                          onClick={async () => {
                            const lat = (+d.point?.lat)?.toFixed(6);
                            const lon = (+d.point?.lng)?.toFixed(6);
                            setValue('location', d.name, {
                              shouldValidate: true,
                            });
                            setValue('lat', lat, { shouldValidate: true });
                            setValue('lon', lon, { shouldValidate: true });
                            setValue('country', d.country, {
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
                      ref={register({ required: true })}
                      name="lat"
                      placeholder="00,000000"
                      className="ml-1 w-full focus:outline-none"
                    />
                  </div>
                  <div className="pl-4 flex items-center">
                    <span className="font-semibold">Lon:</span>
                    <input
                      ref={register({ required: true })}
                      name="lon"
                      placeholder="00,000000"
                      className="ml-1 w-full focus:outline-none"
                    />
                  </div>
                  <div
                    onClick={async () => {
                      const { location, lat, lon } = getValues();
                      if (location && lat && lon) {
                        const { ok, error, timeZone } = await getTimeZone(
                          lat,
                          lon,
                        );
                        if (ok && !error && timeZone) {
                          setValue('timeZone', timeZone);
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
            {isGeocodeErr && (
              <div className="mb-4 text-center">
                <FormError err="Geocode API error. Please fill country name manually." />
              </div>
            )}
            <section className="relative p-6 mb-6 grid grid-cols-oneToTwo gap-y-4 rounded-2xl shadow-surround">
              <h3 className="flex items-center text-myGreen-darkest font-semibold">
                Step name
              </h3>
              <div className="flex">
                <input
                  ref={register({ required: true })}
                  name="name"
                  placeholder="-"
                  className="input w-full rounded-r-none"
                />
                <input
                  ref={register({ required: true })}
                  name="country"
                  readOnly={!isGeocodeErr}
                  placeholder={isGeocodeErr ? 'Country' : ''}
                  style={{
                    width: isGeocodeErr
                      ? '120px'
                      : watch('country')?.length + 2 + 'ch',
                  }}
                  className={`px-2 py-3 text-myGray-dark border border-l-0 border-myGray bg-myGray-light rounded-r-md rounded-l-none focus:outline-none`}
                />
              </div>
              <h3 className="flex items-center text-myGreen-darkest font-semibold">
                Arrival Date & Time
              </h3>
              <div className="flex">
                <input
                  ref={register({ required: true })}
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
                      {getValues().arrivedAt && getValues().timeZone
                        ? moment
                            .tz(watch('arrivedAt'), watch('timeZone'))
                            .format('MMM D YYYY')
                        : ''}
                    </span>
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="text-myBlue text-xl"
                    />
                  </div>
                  {isPopupCalendar && getValues('timeZone') && (
                    <NewCalendar
                      name="arrivedAt"
                      timeZone={getValues('timeZone')}
                      selectedDate={getValues('arrivedAt')}
                      effectiveSince={tripStartDate}
                      effectiveUntil={
                        tripEndDate
                          ? moment(tripEndDate).add(1, 'days').format()
                          : null
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
                      {getValues().arrivedAt && getValues().timeZone
                        ? moment
                            .tz(watch('arrivedAt'), watch('timeZone'))
                            .format('HH : mm')
                        : ''}
                    </span>
                    <FontAwesomeIcon
                      icon={faClock}
                      className="text-myBlue text-xl"
                    />
                  </div>
                  {isPopupCalendar === false && (
                    <Clock timeZone={watch('timeZone')} />
                  )}
                  <input
                    ref={register()}
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
                ref={register()}
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
                setImagesRecord={setImagesRecord}
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
                    } = getValues();
                    const isFormFullfilled =
                      location && lat && lon && country && timeZone;
                    if (isFormFullfilled || isGeocodeErr) {
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
                    !formState.isValid ||
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
    </>
  );
};
