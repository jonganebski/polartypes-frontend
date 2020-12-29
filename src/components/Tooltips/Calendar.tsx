import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment, { months, weekdaysShort } from 'moment-timezone';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Day } from './partials/Day';

const range = (
  start: number,
  stop: number,
  year: number,
  month: number,
  timeZone: string,
) =>
  Array.from({ length: stop - start + 1 }, (_, i) =>
    moment()
      .tz(timeZone)
      .set({ year, month, date: start + i }),
  );

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
  const { getValues, setValue } = useFormContext();
  const [calendarDate, setCalendarDate] = useState(
    selectedDate ? selectedDate : moment(new Date()).tz(timeZone).format(),
  );
  const thisYear = moment.tz(calendarDate, timeZone).get('year');
  const thisMonthIndex = moment.tz(calendarDate, timeZone).get('month');
  const lastDateLastMonth = moment
    .tz(calendarDate, timeZone)
    .month(thisMonthIndex - 1)
    .endOf('month')
    .date();
  const lastDateThisMonth = moment
    .tz(calendarDate, timeZone)
    .month(thisMonthIndex)
    .endOf('month')
    .date();
  const firstDayIdxThisMonth = moment
    .tz(calendarDate, timeZone)
    .month(thisMonthIndex)
    .startOf('month')
    .day();
  const datesLastMonth = range(
    lastDateLastMonth - firstDayIdxThisMonth + 1,
    lastDateLastMonth,
    thisYear,
    thisMonthIndex - 1,
    timeZone,
  );
  const datesThisMonth = range(
    1,
    lastDateThisMonth,
    thisYear,
    thisMonthIndex,
    timeZone,
  );
  const emptySpacesCount =
    7 - ((datesLastMonth.length + datesThisMonth.length) % 7);
  const datesNextMonth = range(
    1,
    emptySpacesCount,
    thisYear,
    thisMonthIndex + 1,
    timeZone,
  );
  const yearsIdx = Array.from(Array(thisYear - 1970 + 16).keys());
  const onMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCalendarDate((prev) => {
      const updated = moment
        .tz(prev, timeZone)
        .set('month', +e.target.value)
        .format();
      return updated;
    });
  };
  const onYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCalendarDate((prev) => {
      const updated = moment
        .tz(prev, timeZone)
        .set('year', +e.target.value)
        .format();
      return updated;
    });
  };
  const onDateClick = (date: moment.Moment) => {
    const prev = getValues(name);
    let updated: string;
    if (prev) {
      updated = moment
        .tz(prev, timeZone)
        .set('years', date.get('years'))
        .set('months', date.get('months'))
        .set('dates', date.get('dates'))
        .format();
    } else {
      updated = date.tz(timeZone).format();
    }
    setValue(name, updated, { shouldValidate: true });
  };
  const onPrevMonthClick = () => {
    setCalendarDate((prev) => {
      const updated = moment
        .tz(prev, timeZone)
        .subtract(moment.duration({ months: 1 }))
        .format();
      return updated;
    });
  };
  const onNextMonthClick = () => {
    setCalendarDate((prev) => {
      const updated = moment(prev).add(1, 'months').tz(timeZone).format();
      return updated;
    });
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
          let isValid;
          if (effectiveSince && effectiveUntil) {
            isValid = date.isBetween(
              moment.tz(effectiveSince, timeZone),
              moment.tz(effectiveUntil, timeZone),
            );
          } else {
            isValid = true;
          }
          return (
            <Day
              key={i}
              isValid={isValid}
              isSelectedDate={isSelectedDate}
              date={date.get('dates')}
              onClick={() => onDateClick(date)}
            />
          );
        })}
        {datesThisMonth.map((date: moment.Moment, i) => {
          const isSelectedDate = date.isSame(selectedDate, 'day');
          let isValid;
          if (effectiveSince && effectiveUntil) {
            isValid = date.isBetween(
              moment.tz(effectiveSince, timeZone),
              moment.tz(effectiveUntil, timeZone),
            );
          } else {
            isValid = true;
          }
          return (
            <Day
              key={i}
              isValid={isValid}
              isSelectedDate={isSelectedDate}
              date={date.get('dates')}
              isThisMonth={true}
              onClick={() => onDateClick(date)}
            />
          );
        })}
        {datesNextMonth.map((date, i) => {
          const isSelectedDate = date.isSame(selectedDate, 'day');
          let isValid;
          if (effectiveSince && effectiveUntil) {
            isValid = date.isBetween(
              moment.tz(effectiveSince, timeZone),
              moment.tz(effectiveUntil, timeZone),
            );
          } else {
            isValid = true;
          }
          return (
            <Day
              key={i}
              isValid={isValid}
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
