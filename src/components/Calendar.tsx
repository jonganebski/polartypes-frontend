import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { DAY_STRINGS, MONTHS } from '../constants';

const range = (start: number, stop: number, year: number, month: number) =>
  Array.from(
    { length: stop - start + 1 },
    (_, i) => new Date(year, month, start + i),
  );

interface ICalendarProps {
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  initialDateState: Date;
  effectiveSince?: Date | null;
  nullable?: boolean;
}

export const Calendar: React.FC<ICalendarProps> = ({
  selectedDate,
  setSelectedDate,
  initialDateState,
  effectiveSince = null,
  nullable = false,
}) => {
  const [calendarDate, setCalendarDate] = useState<Date>(
    selectedDate ?? initialDateState,
  );
  const thisYear = calendarDate?.getFullYear();
  const thisMonthIndex = calendarDate?.getMonth();
  const lastDateLastMonth = new Date(thisYear, thisMonthIndex, 0).getDate();
  const lastDateThisMonth = new Date(thisYear, thisMonthIndex + 1, 0).getDate();
  const firstDayIdxThisMonth = new Date(thisYear, thisMonthIndex, 1).getDay();
  const datesLastMonth = range(
    lastDateLastMonth - firstDayIdxThisMonth + 1,
    lastDateLastMonth,
    thisYear,
    thisMonthIndex - 1,
  );
  const datesThisMonth = range(1, lastDateThisMonth, thisYear, thisMonthIndex);
  const emptySpacesCount =
    7 - ((datesLastMonth.length + datesThisMonth.length) % 7);
  const datesNextMonth = range(
    1,
    emptySpacesCount,
    thisYear,
    thisMonthIndex + 1,
  );
  const yearsIdx = Array.from(Array(thisYear - 1970 + 16).keys());
  const onMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCalendarDate((prev) => {
      const updated = new Date(
        prev.getFullYear(),
        +e.target.value,
        prev.getDate(),
      );
      return updated;
    });
  };
  const onYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCalendarDate((prev) => {
      const updated = new Date(
        +e.target.value,
        prev.getMonth(),
        prev.getDate(),
      );
      return updated;
    });
  };
  const onDateClick = (date: Date) => {
    setSelectedDate(date);
  };
  const onPrevMonthClick = () => {
    setCalendarDate((prev) => {
      const updated = new Date(
        prev.getFullYear(),
        prev.getMonth() - 1,
        prev.getDate(),
      );
      return updated;
    });
  };
  const onNextMonthClick = () => {
    setCalendarDate((prev) => {
      const updated = new Date(
        prev.getFullYear(),
        prev.getMonth() + 1,
        prev.getDate(),
      );
      return updated;
    });
  };
  return (
    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-10 px-1 py-5 bg-myGray-darkest rounded-2xl">
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
      <div className="mb-4 flex items-center">
        <div
          onClick={onPrevMonthClick}
          className="w-8 h-8 rounded-full mr-2 flex items-center justify-center cursor-pointer text-white hover:bg-myBlue"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </div>
        <select
          onChange={onMonthChange}
          value={thisMonthIndex}
          className="p-1 mr-2 rounded-sm text-myBlue focus:outline-none"
        >
          {MONTHS.map((month, i) => (
            <option key={i} value={i}>
              {month}
            </option>
          ))}
        </select>
        <select
          onChange={onYearChange}
          value={thisYear}
          className="p-1 rounded-sm text-myBlue focus:outline-none"
        >
          {yearsIdx.map((i) => {
            return (
              <option key={i} value={1970 + i}>
                {1970 + i}
              </option>
            );
          })}
        </select>
        <div
          onClick={onNextMonthClick}
          className="w-8 h-8 rounded-full ml-2 flex items-center justify-center cursor-pointer text-white hover:bg-myBlue"
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </div>
      </div>
      <div className="mb-4 grid grid-cols-7 justify-items-center text-myGray-dark text-xs">
        {DAY_STRINGS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 justify-items-center text-myGray-dark text-xs">
        {datesLastMonth.map((date, i) => {
          if (effectiveSince && date.getTime() <= effectiveSince?.getTime()) {
            return (
              <span
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center opacity-5"
              >
                {date.getDate()}
              </span>
            );
          } else {
            return (
              <span
                key={i}
                onClick={() => onDateClick(date)}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              >
                {date.getDate()}
              </span>
            );
          }
        })}
        {datesThisMonth.map((date, i) => {
          if (effectiveSince && date.getTime() <= effectiveSince?.getTime()) {
            return (
              <span
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white opacity-5 `}
              >
                {date.getDate()}
              </span>
            );
          } else {
            return (
              <span
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer ${
                  date.getTime() === selectedDate?.getTime() && 'bg-myBlue'
                }`}
                onClick={() => onDateClick(date)}
              >
                {date.getDate()}
              </span>
            );
          }
        })}
        {datesNextMonth.map((date, i) => {
          if (effectiveSince && date.getTime() <= effectiveSince?.getTime()) {
            return (
              <span
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center opacity-5"
              >
                {date.getDate()}
              </span>
            );
          } else {
            return (
              <span
                key={i}
                onClick={() => onDateClick(date)}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              >
                {date.getDate()}
              </span>
            );
          }
        })}
      </div>
      {nullable && (
        <div className="mt-4 flex items-center justify-center">
          <div
            onClick={() => setSelectedDate(null)}
            className="font-semibold rounded-full px-3.5 py-1.5 text-xs border border-myGray-dark text-white cursor-pointer"
          >
            I don't know yet
          </div>
        </div>
      )}
    </div>
  );
};
