import React from 'react';
import { useFormContext } from 'react-hook-form';
import moment from 'moment-timezone';
import { ICreateStepFormProps } from '../../pages/Trip';

const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + step * i);

interface IClockProps {
  timeZone: string;
}

export const Clock: React.FC<IClockProps> = ({ timeZone }) => {
  const { setValue, getValues } = useFormContext<ICreateStepFormProps>();
  const hours = range(0, 23, 1);
  const minutes = Array.from(
    new Set([
      ...range(0, 55, 5),
      moment.tz(getValues().arrivedAt, timeZone).minute(),
    ]),
  ).sort((a, b) => a - b);
  console.log('clock render');
  const onHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { arrivedAt } = getValues();
    const hour = +e.currentTarget.value;
    setValue(
      'arrivedAt',
      moment.tz(arrivedAt, timeZone).set('hour', hour).format(),
      { shouldValidate: true },
    );
  };
  const onMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { arrivedAt } = getValues();
    const minute = +e.currentTarget.value;
    setValue(
      'arrivedAt',
      moment.tz(arrivedAt, timeZone).set('minute', minute).format(),
      { shouldValidate: true },
    );
  };
  return (
    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-10 p-5 bg-myGray-darkest rounded-lg">
      <div
        style={{
          top: '-19px',
          width: '10px',
          height: '10px',
          border: '10px solid transparent',
          borderBottomColor: '#4b5a6c',
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
      ></div>
      <div className="mb-3 flex items-center">
        <select
          onChange={onHourChange}
          defaultValue={moment.tz(getValues().arrivedAt, timeZone).format('HH')}
          className="select"
        >
          {hours.map((h) => {
            const hour = (h + '').padStart(2, '0');
            return (
              <option key={h} value={hour}>
                {hour}
              </option>
            );
          })}
        </select>
        <div className="mx-2 text-white">:</div>
        <select
          onChange={onMinuteChange}
          defaultValue={moment.tz(getValues().arrivedAt, timeZone).format('mm')}
          className="select"
        >
          {minutes.map((m) => {
            const minute = (m + '').padStart(2, '0');
            return (
              <option key={m} value={minute}>
                {minute}
              </option>
            );
          })}
        </select>
      </div>
      <div className="grid text-center text-myGray font-semibold">
        <span>Timezone:</span>
        <span className="bg-transparent w-full text-center text-myGray font-semibold">
          {timeZone}
        </span>
      </div>
    </div>
  );
};
