import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { faCamera, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { INITIAL_DATE_STATE } from '../../constants';
import { formatDate, getTimeZone } from '../../helpers';
import { useGeocoder } from '../../hooks/useGeocoder';
import { Button } from '../Button';
import { ModalCloseIcon } from './partials/CloseIcon';
import { Calendar } from '../Tooltips/Calendar';
import { Clock } from '../Tooltips/Clock';
import { UploadBox } from './partials/UploadBox';

interface ICreateStepModal {
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
  arrivedDate: string;
  arrivedTime: string;
  timeZone: string;
  images: FileList;
}

export const CreateStepModal: React.FC<ICreateStepModal> = ({
  tripStartDate,
  tripEndDate,
  belowStepDate,
  belowStepTimeZone,
  setIsCreateStepModal,
}) => {
  const belowDateObj = belowStepDate ? new Date(belowStepDate) : new Date();
  const belowLocalDate = moment(belowStepDate).tz(belowStepTimeZone);
  const [arrivedDate, setArrivedDate] = useState<Date | null>(belowDateObj);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupCalendar, setIsPopupCalendar] = useState<boolean | null>(null);
  const f = useForm<ICreateStepFormProps>({
    mode: 'onChange',
    defaultValues: {
      arrivedTime: `${belowLocalDate?.hour() ?? '00'}:00`,
    },
  });
  const { geocodeData, setGeocodeData } = useGeocoder(searchTerm);
  const onLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
  };
  const onSubmit = () => {
    console.log(f.getValues());
  };
  return (
    <FormProvider {...f}>
      <div className="absolute z-50 top-0 left-0 w-full h-full bg-myGreen-darkest bg-opacity-80"></div>
      <div className="absolute z-50 top-0 left-0 w-full h-screenExceptHeader overflow-y-scroll">
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-11/12 bg-white rounded-2xl">
          <ModalCloseIcon onClick={() => setIsCreateStepModal(false)} />
          <div className="py-6 text-center text-2xl text-myGreen-darkest font-semibold border-b">
            New Trip
          </div>
          <form onSubmit={f.handleSubmit(onSubmit)} className="p-6">
            <section className="p-6 mb-4 grid grid-cols-oneToTwo bg-myGray-dark rounded-2xl">
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
                      const { lat, lon } = f.getValues();
                      const { ok, error, timeZone } = await getTimeZone(
                        lat,
                        lon,
                      );
                      if (ok && !error && timeZone) {
                        console.log(timeZone);
                        f.setValue('timeZone', timeZone);
                      }
                    }}
                    className="py-1.5 px-4 rounded-full bg-myBlue text-white cursor-pointer"
                  >
                    Set
                  </div>
                </div>
              </div>
            </section>
            <section className="p-6 mb-6 grid grid-cols-oneToTwo gap-y-4 rounded-2xl shadow-surround">
              <h3 className="text-myGreen-darkest font-semibold">Step name</h3>
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
              <h3 className="text-myGreen-darkest font-semibold">
                Arrival Date & Time
              </h3>
              <div className="flex">
                <div className="relative mr-4 w-full min-w-min">
                  <input
                    ref={f.register({
                      required: true,
                      setValueAs: () => {
                        if (!arrivedDate) {
                          f.setError('arrivedDate', {
                            message: 'Arrival date is not provided.',
                          });
                          return;
                        }
                        const year = arrivedDate.getFullYear();
                        const month = (arrivedDate.getMonth() + 1)
                          .toString()
                          .padStart(2, '0');
                        const date = arrivedDate
                          .getDate()
                          .toString()
                          .padStart(2, '0');
                        const ISO8601_UTC = moment
                          .utc(`${year}-${month}-${date}`)
                          .format();
                        if (ISO8601_UTC !== 'Invalid date') {
                          return ISO8601_UTC;
                        }
                        return null;
                      },
                    })}
                    name="arrivedDate"
                    onClick={() =>
                      setIsPopupCalendar((prev) => (prev ? null : true))
                    }
                    value={formatDate(arrivedDate, 'short')}
                    readOnly
                    className={`px-4 py-3 w-full border border-solid rounded-sm cursor-pointer focus:outline-none ${
                      isPopupCalendar ? 'border-myBlue' : 'border-myGray'
                    }`}
                  />
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="absolute top-1/2 transform -translate-y-1/2 right-3 text-myBlue text-xl"
                  />
                  {isPopupCalendar && (
                    <Calendar
                      selectedDate={arrivedDate}
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
                <div className="relative min-w-min">
                  <input
                    ref={f.register({ required: true })}
                    name="arrivedTime"
                    onClick={() =>
                      setIsPopupCalendar((prev) =>
                        prev === false ? null : false,
                      )
                    }
                    readOnly
                    className={`pl-4 py-3 w-full border border-solid rounded-sm cursor-pointer focus:outline-none ${
                      isPopupCalendar === false
                        ? 'border-myBlue'
                        : 'border-myGray'
                    }`}
                  />
                  <FontAwesomeIcon
                    icon={faClock}
                    className="absolute top-1/2 transform -translate-y-1/2 right-3 text-myBlue text-xl"
                  />
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
              <h3 className="text-myGreen-darkest font-semibold">Your story</h3>
              <textarea
                ref={f.register()}
                name="story"
                placeholder="What have you been up to?"
                className="resize-none px-4 py-3 h-48 border border-myGray rounded-sm focus:outline-none focus:border-myBlue"
              />
              <h3 className="text-myGreen-darkest font-semibold">
                Add your photos
              </h3>
              <UploadBox />
            </section>
            <div>
              <Button
                text="Add step"
                type="red-solid"
                disabled={!f.formState.isValid}
                className="mr-4"
              />
              <Button
                text="Cancel"
                type="white-solid"
                onClick={() => setIsCreateStepModal(false)}
              />
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};