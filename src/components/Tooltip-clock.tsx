import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ICreateStepFormProps } from './Modal-create-step';

const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + step * i);

interface IClockProps {}

export const Clock: React.FC<IClockProps> = () => {
  const { register } = useFormContext<ICreateStepFormProps>();
  const hours = range(0, 23, 1);
  const minutes = range(0, 55, 5);
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
        <select className="select">
          {hours.map((h) => {
            const hour = (h + '').padStart(2, '0');
            return (
              <option key={h} value={h}>
                {hour}
              </option>
            );
          })}
        </select>
        <div className="mx-2 text-white">:</div>
        <select className="select">
          {minutes.map((m) => {
            const minute = (m + '').padStart(2, '0');
            return (
              <option key={m} value={m}>
                {minute}
              </option>
            );
          })}
        </select>
      </div>
      <div className="grid text-center text-myGray font-semibold">
        <span>Timezone:</span>
        <input
          ref={register({ required: true })}
          name="timeZone"
          readOnly
          className="bg-transparent w-full text-center text-myGray font-semibold focus:outline-none"
        />
      </div>
    </div>
  );
};
