import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment, { months, weekdaysShort } from 'moment-timezone';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useCalendar } from '../../hooks/useCalendar';
import { Day } from './partials/Day';

interface ICalendarProps {
  name: string;
  timeZone: string;
  selectedDate: string;
  effectiveSince?: string | null;
  effectiveUntil?: string | null;
  nullable?: boolean;
}

export const NewCalendar: React.FC<ICalendarProps> = ({
  name,
  timeZone,
  selectedDate,
  effectiveSince = null,
  effectiveUntil = null,
  nullable = false,
}) => {
  const { setValue } = useFormContext();
  const {
    datesLastMonth,
    datesThisMonth,
    datesNextMonth,
    thisMonthIndex,
    yearsIdx,
    thisYear,
    onDateClick,
    onMonthChange,
    onNextMonthClick,
    onPrevMonthClick,
    onYearChange,
  } = useCalendar(name, selectedDate, timeZone);

  const computeIsValid = (date: moment.Moment) => {
    if (effectiveSince && effectiveUntil) {
      return date.isBetween(
        moment.tz(effectiveSince, timeZone),
        moment.tz(effectiveUntil, timeZone),
      );
    } else if (effectiveSince && !effectiveUntil) {
      return date.isAfter(moment.tz(effectiveSince, timeZone));
    } else {
      return true;
    }
  };

  return (
    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-10 px-1 py-5 bg-myGray-darkest rounded-2xl cursor-pointer">
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
          className="select mr-2"
        >
          {months().map((month, i) => (
            <option key={i} value={i}>
              {month}
            </option>
          ))}
        </select>
        <select
          onChange={onYearChange}
          value={thisYear}
          className="select mr-2"
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
        {weekdaysShort().map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 justify-items-center text-myGray-dark text-xs">
        {datesLastMonth.map((date: moment.Moment, i) => {
          const isSelectedDate = date.isSame(selectedDate, 'day');
          return (
            <Day
              key={i}
              isValid={computeIsValid(date)}
              isSelectedDate={isSelectedDate}
              date={date.get('dates')}
              onClick={() => onDateClick(date)}
            />
          );
        })}
        {datesThisMonth.map((date: moment.Moment, i) => {
          const isSelectedDate = date.isSame(selectedDate, 'day');
          return (
            <Day
              key={i}
              isValid={computeIsValid(date)}
              isSelectedDate={isSelectedDate}
              date={date.get('dates')}
              isThisMonth={true}
              onClick={() => onDateClick(date)}
            />
          );
        })}
        {datesNextMonth.map((date, i) => {
          const isSelectedDate = date.isSame(selectedDate, 'day');
          return (
            <Day
              key={i}
              isValid={computeIsValid(date)}
              isSelectedDate={isSelectedDate}
              date={date.get('dates')}
              onClick={() => onDateClick(date)}
            />
          );
        })}
      </div>
      {nullable && (
        <div className="mt-4 flex items-center justify-center">
          <div
            onClick={() => setValue(name, '')}
            className="font-semibold rounded-full px-3.5 py-1.5 text-xs border border-myGray-dark text-white cursor-pointer"
          >
            I don't know yet
          </div>
        </div>
      )}
    </div>
  );
};
