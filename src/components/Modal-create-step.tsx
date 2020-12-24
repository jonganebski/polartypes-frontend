import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { faCamera, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { INITIAL_DATE_STATE } from '../constants';
import { getTimeZone } from '../helpers';
import { useGeocoder } from '../hooks/useGeocoder';
import { Button } from './Button';
import { ModalCloseIcon } from './Icon-close-modal';
import { Calendar } from './Tooltip-calendar';
import { Clock } from './Tooltip-clock';

interface ICreateStepModal {
  setIsCreateStepModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ICreateStepFormProps {
  location: string;
  name: string;
  country: string;
  lat: string;
  lon: string;
  arrivedDate: string;
  arrivedTime: string;
  timeZone: string;
}

export const CreateStepModal: React.FC<ICreateStepModal> = ({
  setIsCreateStepModal,
}) => {
  const [arrivedDate, setArrivedDate] = useState<Date | null>(
    INITIAL_DATE_STATE,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupCalendar, setIsPopupCalendar] = useState<boolean | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const f = useForm<ICreateStepFormProps>({
    mode: 'onChange',
    defaultValues: { arrivedTime: '13:20' },
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
                            f.setValue('location', d.name);
                            f.setValue('lat', lat);
                            f.setValue('lon', lon);
                            f.setValue('country', d.country);
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
                <div className="relative mr-4 w-full">
                  <input
                    ref={f.register({
                      required: true,
                      setValueAs: (value) => {
                        console.log(value);
                        const ISO8601_UTC = moment.utc(value).format();
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
                    value={arrivedDate?.toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
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
                    className={`px-4 py-3 w-full border border-solid rounded-sm cursor-pointer focus:outline-none ${
                      isPopupCalendar === false
                        ? 'border-myBlue'
                        : 'border-myGray'
                    }`}
                  />
                  <FontAwesomeIcon
                    icon={faClock}
                    className="absolute top-1/2 transform -translate-y-1/2 right-3 text-myBlue text-xl"
                  />
                  {isPopupCalendar === false && <Clock />}
                </div>
              </div>
              <h3 className="text-myGreen-darkest font-semibold">Your story</h3>
              <textarea
                ref={f.register({ required: true })}
                name="story"
                placeholder="What have you been up to?"
                className="resize-none px-4 py-3 h-48 border border-myGray rounded-sm focus:outline-none focus:border-myBlue"
              />
              <h3 className="text-myGreen-darkest font-semibold">
                Add your photos
              </h3>
              <div className="p-2 gap-3 grid grid-cols-4 border border-myGray rounded-sm">
                <div className="relative pt-square border border-dashed border-myBlue rounded-md">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-p90 pt-p90 bg-myGray-dark rounded-sm"></div>
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    className="absolute top-0 right-0 text-xl cursor-pointer bg-white rounded-full hover:text-myRed"
                  />
                </div>
                <div className="relative pt-square border border-myBlue rounded-md cursor-pointer group hover:bg-myBlue">
                  <FontAwesomeIcon
                    icon={faCamera}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-myBlue text-lg group-hover:text-white"
                  />
                </div>
              </div>
              <input
                ref={f.register()}
                name="images"
                type="file"
                className=""
                accept="image/*"
                multiple={true}
              />
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
