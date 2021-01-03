import moment from 'moment-timezone';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

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

export const useCalendar = (
  name: string,
  selectedDate: string,
  timeZone: string,
) => {
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
  return {
    datesLastMonth,
    datesThisMonth,
    datesNextMonth,
    thisMonthIndex,
    yearsIdx,
    thisYear,
    onMonthChange,
    onYearChange,
    onDateClick,
    onPrevMonthClick,
    onNextMonthClick,
  };
};
